import React from "react";
import { DownloadOutlined } from "@ant-design/icons";

const DownloadButton: React.FC<{ url: string; label?: string }> = ({ url, label = "Download" }) => (
  <a
    href={url}
    download
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 12px",
      borderRadius: 8,
      background: "#f5f7fa",
      color: "#228e8d",
      fontWeight: 600,
      fontSize: 14,
      textDecoration: "none",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1.5px 5px rgba(76,201,196,0.05)",
      transition: "background 0.2s, color 0.2s",
    }}
    title="Download file"
    target="_blank"
    rel="noopener noreferrer"
    onClick={e => {
      // For cross-origin files, force browser behavior
      if (!url.startsWith(window.location.origin)) {
        e.preventDefault();
        window.open(url, "_blank", "noopener");
      }
    }}
  >
    <DownloadOutlined style={{ fontSize: 16 }} />
    <span>{label}</span>
  </a>
);

export default DownloadButton;