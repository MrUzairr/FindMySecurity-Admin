"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Search,
  FileCheck,
  User2,
} from "lucide-react";
// Documents
interface Document {
  documentId: number;
  userId: number;
  status: "pending" | "verified" | "rejected";
  uploadedAt: string;
  fileUrl: string;
}

const mockDocuments: Document[] = [
  {
    documentId: 101,
    userId: 1,
    status: "pending",
    uploadedAt: "2025-05-08T16:21:43",
    fileUrl: "https://example.com/doc1.pdf",
  },
  {
    documentId: 102,
    userId: 1,
    status: "verified",
    uploadedAt: "2025-05-08T16:25:10",
    fileUrl: "https://example.com/doc2.pdf",
  },
  {
    documentId: 103,
    userId: 2,
    status: "pending",
    uploadedAt: "2025-05-08T16:30:15",
    fileUrl: "https://example.com/doc3.pdf",
  },
  {
    documentId: 104,
    userId: 3,
    status: "rejected",
    uploadedAt: "2025-05-08T16:33:15",
    fileUrl: "https://example.com/doc4.pdf",
  },
];

const statusStyle = {
  verified: "bg-green-100 text-green-800 border border-green-300",
  rejected: "bg-red-100 text-red-800 border border-red-300",
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
};

const DocumentVerification: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDocuments(mockDocuments);
  }, []);

  const handleStatusChange = (id: number, newStatus: "verified" | "rejected") => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.documentId === id ? { ...doc, status: newStatus } : doc
      )
    );
  };

  const filtered = documents.filter((doc) => {
    const q = search.toLowerCase();
    return (
      doc.userId.toString().includes(q) ||
      doc.documentId.toString().includes(q) ||
      doc.status.includes(q)
    );
  });

  const grouped = filtered.reduce((acc: Record<number, Document[]>, doc) => {
    acc[doc.userId] = acc[doc.userId] || [];
    acc[doc.userId].push(doc);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 flex items-center justify-center gap-3">
          <FileCheck className="w-8 h-8" /> Document Verification
        </h1>

        <div className="mb-8 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by User ID, Doc ID or Status..."
            className="w-full py-3 pl-12 pr-4 rounded-xl shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-500">No documents found.</p>
        ) : (
          Object.entries(grouped).map(([userId, docs]) => (
            <div key={userId} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <User2 className="w-6 h-6 text-blue-600" />
                User ID: {userId}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-800">
                        Document #{doc.documentId}
                      </h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${statusStyle[doc.status]}`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      Uploaded on:{" "}
                      {new Date(doc.uploadedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() =>
                          handleStatusChange(doc.documentId, "verified")
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 transition"
                      >
                        <CheckCircle size={16} /> Verify
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(doc.documentId, "rejected")
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700 transition"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white bg-gray-800 hover:bg-black transition"
                      >
                        <Eye size={16} /> View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentVerification;
