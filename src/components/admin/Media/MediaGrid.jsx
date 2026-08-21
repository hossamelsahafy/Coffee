"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConfig } from "@payloadcms/ui";
import Header from "@/components/shared/AdminUI/Header";
import Pagination from "@/components/shared/AdminUI/Pagination";

export default function MediaGrid() {
  const { config } = useConfig();
  const adminRoute = config.routes?.admin || "/admin";

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const limit = 20;

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchMedia = async (targetPage = 1, searchValue = "") => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        limit: String(limit),
        page: String(targetPage),
        depth: "1",
        sort: "-createdAt",
      });

      if (searchValue.trim()) {
        params.set("where[filename][contains]", searchValue.trim());
      }

      const res = await fetch(`/api/media?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch media");
      }

      const data = await res.json();

      setDocs(data.docs || []);
      setPage(data.page || targetPage);
      setTotalPages(data.totalPages || 1);
      setTotalDocs(data.totalDocs || 0);
      setHasPrevPage(data.hasPrevPage || false);
      setHasNextPage(data.hasNextPage || false);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia(1, "");
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    setHiddenIds([]);
    fetchMedia(1, value);
  };

  const handleResetSearch = () => {
    setSearch("");
    setHiddenIds([]);
    fetchMedia(1, "");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMedia(newPage, search);
    }
  };

  const toggleSelect = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (visibleDocs) => {
    const allIds = visibleDocs.map((doc) => doc.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const promptBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setShowConfirmModal(true);
  };

  const executeBulkDelete = async () => {
    setShowConfirmModal(false);
    const idsToDelete = [...selectedIds];

    try {
      setIsDeleting(true);

      const res = await fetch(
        `/api/media?where[id][in]=${idsToDelete.join(",")}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete selected media");
      }

      setHiddenIds((prev) => [...new Set([...prev, ...idsToDelete])]);
      setSelectedIds([]);
      showToast(`Successfully deleted ${idsToDelete.length} media item(s).`);
    } catch (error) {
      console.error("Error bulk deleting media:", error);
      showToast("Error deleting media items. Check console.");
    } finally {
      setIsDeleting(false);
    }
  };

  const visibleDocs = docs.filter((media) => !hiddenIds.includes(media.id));

  return (
    <div className="p-6 text-[#E8D8C3] relative">
      <Header
        handleResetSearch={handleResetSearch}
        handleSearch={handleSearch}
        adminRoute={adminRoute}
        CollectionName="Media"
        search={search}
        searchBy="Search By FileName ..."
        slug="media"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#271d18] border border-[#c89553] text-[#E8D8C3] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span className="text-[#c89553] font-bold">ℹ</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A120D] border border-[#3A2A22] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-[#f3ece7] mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-[#9e8a78] mb-6">
              Are you sure you want to delete{" "}
              <span className="text-[#E8D8C3] font-bold">
                {selectedIds.length}
              </span>{" "}
              selected item(s)? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#271d18] text-[#E8D8C3] border border-[#423128] hover:border-[#8c6a51] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeBulkDelete}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-900/80 text-red-100 border border-red-700 hover:bg-red-800 transition-all shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center my-4 bg-[#1A120D] border border-[#3A2A22] p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleSelectAll(visibleDocs)}
            className="text-xs bg-[#271d18] px-3 py-1.5 rounded border border-[#423128] hover:border-[#c89553] transition-all"
          >
            {visibleDocs.length > 0 &&
            visibleDocs.every((doc) => selectedIds.includes(doc.id))
              ? "Deselect Page"
              : "Select Page"}
          </button>

          <span className="text-xs text-[#9e8a78]">
            {selectedIds.length} item(s) selected out of {totalDocs || 0} total
          </span>
        </div>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={promptBulkDelete}
            disabled={isDeleting}
            className="text-xs bg-red-900/60 text-red-200 border border-red-700 px-3 py-1.5 rounded hover:bg-red-800 transition-all font-semibold disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : `Delete Selected (${selectedIds.length})`}
          </button>
        )}
      </div>

      <div className="p-4 bg-[#1A120D] border border-[#3A2A22] rounded-2xl shadow-xl">
        {isLoading ? (
          <div className="py-16 text-center text-[#9e8a78] animate-pulse">
            Loading media library...
          </div>
        ) : visibleDocs.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A6B]">
            No media found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {visibleDocs.map((media) => {
                const image =
                  typeof media.url === "string"
                    ? media.url
                    : media.thumbnailURL || "";

                const isSelected = selectedIds.includes(media.id);

                return (
                  <div
                    key={media.id}
                    className={`group relative overflow-hidden rounded-xl border bg-[#120c0a] transition-all duration-300 ${
                      isSelected
                        ? "border-[#c89553] ring-2 ring-[#c89553]"
                        : "border-[#3A2A22] hover:border-[#c89553] hover:shadow-xl"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => toggleSelect(media.id, e)}
                      aria-label={`Select ${media.filename}`}
                      className="absolute top-2 left-2 z-10 w-5 h-5 rounded flex items-center justify-center bg-[#1a120d]/90 border border-[#423128] cursor-pointer hover:border-[#c89553]"
                    >
                      {isSelected && (
                        <span className="text-[#c89553] text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </button>

                    <div className="aspect-square overflow-hidden bg-[#241812]">
                      <img
                        src={image}
                        alt={media.filename}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="border-t border-[#3A2A22] bg-[#1A120D] p-3">
                      <p
                        className="truncate text-sm font-medium text-[#E8D8C3]"
                        title={media.filename}
                      >
                        {media.filename}
                      </p>

                      <Link
                        href={`${adminRoute}/collections/media/${media.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-md text-xs font-medium bg-[#c89553] text-[#120c07] hover:bg-[#b58347] transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-[#3A2A22]">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  hasPrevPage={hasPrevPage}
                  hasNextPage={hasNextPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
