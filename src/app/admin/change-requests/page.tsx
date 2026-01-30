"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ChangeRequest {
  id: string;
  change_type: string;
  status: string;
  moderation_severity: string | null;
  moderation_reason: string | null;
  created_at: string;
  previous_data: Record<string, unknown> | null;
  new_data: Record<string, unknown>;
  product_id: string | null;
  store: {
    id: string;
    name: string;
    subdomain: string;
    contact_email: string;
    owner: {
      email: string;
      first_name: string | null;
      last_name: string | null;
    };
  };
  reviewer: {
    email: string;
    first_name: string | null;
  } | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export default function ChangeRequestsPage() {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchChangeRequests();
  }, [filter, severityFilter]);

  const fetchChangeRequests = async () => {
    try {
      const params = new URLSearchParams({
        status: filter,
        ...(severityFilter !== "all" && { severity: severityFilter }),
      });
      
      const response = await fetch(`/api/admin/change-requests?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setChangeRequests(data.changeRequests);
        setCounts(data.counts);
      }
    } catch (error) {
      console.error("Error fetching change requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, action: "approve" | "reject") => {
    if (action === "reject" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/change-requests/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action,
          rejection_reason: action === "reject" ? rejectionReason : undefined
        }),
      });

      if (response.ok) {
        setSelectedRequest(null);
        setRejectionReason("");
        fetchChangeRequests();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error reviewing change request:", error);
      alert("Failed to process request");
    } finally {
      setProcessing(false);
    }
  };

  const getSeverityBadge = (severity: string | null) => {
    if (!severity) return null;
    const colors = {
      clean: "bg-green-500/20 text-green-300",
      moderate: "bg-yellow-500/20 text-yellow-300",
      severe: "bg-red-500/20 text-red-300",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[severity as keyof typeof colors] || ""}`}>
        {severity}
      </span>
    );
  };

  const getChangeTypeBadge = (type: string) => {
    const labels = {
      store_info: "Store Info",
      product_create: "New Product",
      product_update: "Product Update",
      product_delete: "Product Delete",
    };
    const colors = {
      store_info: "bg-blue-500/20 text-blue-300",
      product_create: "bg-green-500/20 text-green-300",
      product_update: "bg-yellow-500/20 text-yellow-300",
      product_delete: "bg-red-500/20 text-red-300",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[type as keyof typeof colors] || ""}`}>
        {labels[type as keyof typeof labels] || type}
      </span>
    );
  };

  const renderDiff = (request: ChangeRequest) => {
    const prev = request.previous_data || {};
    const newData = request.new_data;

    return (
      <div className="space-y-4">
        {Object.keys(newData).map((key) => {
          const oldValue = prev[key];
          const newValue = newData[key];
          
          if (oldValue === newValue) return null;

          return (
            <div key={key} className="border border-border rounded-lg p-4">
              <div className="text-sm font-semibold text-foreground mb-2 capitalize">
                {key.replace(/_/g, " ")}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted mb-1">Previous</div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-sm text-foreground">
                    {oldValue ? String(oldValue) : <em className="text-muted">None</em>}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Proposed</div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-sm text-foreground">
                    {newValue ? String(newValue) : <em className="text-muted">None</em>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Change Requests</h1>
        <p className="text-muted mt-2">
          Review and approve vendor changes before they go live
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending ({counts.pending || 0})</option>
          <option value="approved">Approved ({counts.approved || 0})</option>
          <option value="rejected">Rejected ({counts.rejected || 0})</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="input"
        >
          <option value="all">All Severities</option>
          <option value="clean">Clean</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : changeRequests.length === 0 ? (
        <div className="text-center py-12 text-muted">
          No change requests found
        </div>
      ) : (
        <div className="space-y-4">
          {changeRequests.map((request) => (
            <div
              key={request.id}
              className="card rounded-lg p-6 border hover:border-accent transition-colors cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getChangeTypeBadge(request.change_type)}
                    {getSeverityBadge(request.moderation_severity)}
                    <span className={`px-2 py-1 rounded text-xs ${
                      request.status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                      request.status === "approved" ? "bg-green-500/20 text-green-300" :
                      "bg-red-500/20 text-red-300"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="text-foreground font-semibold mb-1">
                    {request.store.name}
                  </div>
                  
                  <div className="text-sm text-muted">
                    {request.store.subdomain}.dude.box • {request.store.owner.first_name || request.store.owner.email}
                  </div>
                  
                  {request.moderation_reason && (
                    <div className="mt-3 text-sm text-yellow-300 bg-yellow-500/10 p-2 rounded">
                      {request.moderation_reason}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted text-right">
                  {new Date(request.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-4xl my-8">
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Review Change Request</h2>
                  <div className="flex items-center gap-3 mt-2">
                    {getChangeTypeBadge(selectedRequest.change_type)}
                    {getSeverityBadge(selectedRequest.moderation_severity)}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-muted hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Store Info */}
              <div className="bg-panel border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Store Information</h3>
                <div className="text-sm space-y-1">
                  <div><span className="text-muted">Store:</span> {selectedRequest.store.name}</div>
                  <div><span className="text-muted">Owner:</span> {selectedRequest.store.owner.first_name} ({selectedRequest.store.owner.email})</div>
                  <div><span className="text-muted">Subdomain:</span> {selectedRequest.store.subdomain}.dude.box</div>
                  <div><span className="text-muted">Submitted:</span> {new Date(selectedRequest.created_at).toLocaleString()}</div>
                </div>
              </div>

              {/* Moderation Info */}
              {selectedRequest.moderation_reason && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-yellow-300">Moderation Alert</h3>
                  <p className="text-sm">{selectedRequest.moderation_reason}</p>
                </div>
              )}

              {/* Changes */}
              <div>
                <h3 className="font-semibold mb-4">Proposed Changes</h3>
                {renderDiff(selectedRequest)}
              </div>

              {/* Actions */}
              {selectedRequest.status === "pending" && (
                <div className="flex gap-4 pt-4 border-t border-border">
                  <div className="flex-1">
                    <textarea
                      placeholder="Rejection reason (required for rejections)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="input w-full"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleReview(selectedRequest.id, "approve")}
                      disabled={processing}
                      className="solid-button px-6 py-2 bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(selectedRequest.id, "reject")}
                      disabled={processing || !rejectionReason.trim()}
                      className="solid-button px-6 py-2 bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedRequest.status !== "pending" && (
                <div className="bg-panel border border-border rounded-lg p-4">
                  <div className="text-sm">
                    <span className="text-muted">Reviewed by:</span> {selectedRequest.reviewer?.first_name || selectedRequest.reviewer?.email}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted">Reviewed at:</span> {selectedRequest.reviewed_at ? new Date(selectedRequest.reviewed_at).toLocaleString() : "N/A"}
                  </div>
                  {selectedRequest.rejection_reason && (
                    <div className="text-sm mt-2">
                      <span className="text-muted">Reason:</span> {selectedRequest.rejection_reason}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
