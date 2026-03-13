import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import InviteTable from "../components/invites/InviteTable";
import {
  fetchInvites,
  resendInvite,
  cancelInvite
} from "../api/invites";

const Invites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInvites = async () => {
    try {
      const res = await fetchInvites();

      // ensure safe data format
      setInvites(res.data || []);

    } catch (error) {
      console.error("Failed to load invites:", error);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const handleResend = async (id) => {
    try {
      setLoading(true);
      await resendInvite(id);
      await loadInvites();
    } catch (error) {
      console.error("Resend failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      await cancelInvite(id);
      await loadInvites();
    } catch (error) {
      console.error("Cancel failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper>

        <h1 className="text-2xl font-bold mb-6">
          Society Invites
        </h1>

        {loading && (
          <p className="text-sm text-gray-500 mb-2">
            Updating...
          </p>
        )}

        <InviteTable
          invites={invites}
          onResend={handleResend}
          onCancel={handleCancel}
        />

      </PageWrapper>
    </AppLayout>
  );
};

export default Invites;