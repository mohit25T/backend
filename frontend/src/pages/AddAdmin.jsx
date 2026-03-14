import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import CreateSocietyForm from "../components/societies/CreateSocietyForm";
import api from "../api/axios";

const AddAdminWithSociety = () => {

  const [mode, setMode] = useState("single");

  const [societies, setSocieties] = useState([]);
  const [societyId, setSocietyId] = useState("");

  const [wings, setWings] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [showSocietyModal, setShowSocietyModal] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [wing, setWing] = useState("");
  const [flatNo, setFlatNo] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* =============================
     LOAD SOCIETIES
  ============================= */

  const loadSocieties = async () => {
    const res = await api.get("/societies");
    setSocieties(res.data);
  };

  useEffect(() => {
    loadSocieties();
  }, []);

  /* =============================
     SOCIETY SELECT
  ============================= */

  const handleSocietyChange = (e) => {
    const value = e.target.value;

    if (value === "OTHER") {
      setShowSocietyModal(true);
      return;
    }

    setSocietyId(value);

    const society = societies.find((s) => s._id === value);

    const wingsData =
      society?.wings && society.wings.length > 0
        ? society.wings
        : ["A", "B", "C", "D"];

    setWings(wingsData);

    setAdmins(
      wingsData.map((w) => ({
        wing: w,
        name: "",
        email: "",
        mobile: "",
        flatNo: "",
      })),
    );
  };

  /* =============================
     CREATE SOCIETY
  ============================= */

  const handleCreateSociety = async (data) => {
    try {
      const res = await api.post("/societies", data);

      const newSociety = res.data;

      await loadSocieties();

      setSocietyId(newSociety._id);

      setWings(newSociety.wings || []);

      setAdmins(
        (newSociety.wings || []).map((w) => ({
          wing: w,
          name: "",
          email: "",
          mobile: "",
          flatNo: "",
        })),
      );

      setShowSocietyModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* =============================
     BULK CHANGE
  ============================= */

  const handleBulkChange = (index, field, value) => {
    const updated = [...admins];

    updated[index][field] = value;

    setAdmins(updated);
  };

  /* =============================
     SUBMIT ADMIN
  ============================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      if (mode === "single") {
        await api.post("/invites/admin", {
          name,
          mobile,
          email,
          wing,
          flatNo,
          societyId,
        });

        setMsg("Admin invited successfully");
      } else {
        const payload = admins.filter(
          (a) => a.name && a.mobile && a.email && a.flatNo,
        );

        await api.post("/invites/admin/bulk", {
          societyId,
          admins: payload,
        });

        setMsg("Wing admins invited successfully");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Add Admin</h1>

          {/* MODE SWITCH */}

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`px-4 py-2 rounded ${mode === "single" ? "bg-black text-white" : "border"}`}
            >
              Single Admin
            </button>

            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`px-4 py-2 rounded ${mode === "bulk" ? "bg-black text-white" : "border"}`}
            >
              Wing-wise Setup
            </button>
          </div>

          {/* SOCIETY SELECT */}

          <select
            value={societyId}
            onChange={handleSocietyChange}
            className="w-full border p-3 rounded mb-6"
          >
            <option value="">Select Society</option>

            {societies.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.city})
              </option>
            ))}

            <option value="OTHER">➕ Other (Create New Society)</option>
          </select>

          {/* =============================
             SINGLE ADMIN MODE
          ============================= */}

          {mode === "single" && (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Admin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 rounded"
              />

              <input
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 rounded"
              />

              <input
                placeholder="Admin Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border p-3 rounded"
              />

              {/* WING DROPDOWN */}

              <select
                value={wing}
                onChange={(e) => setWing(e.target.value)}
                className="border p-3 rounded"
              >
                <option value="">Select Wing</option>

                {wings.map((w) => (
                  <option key={w} value={w}>
                    Wing {w}
                  </option>
                ))}
              </select>

              <input
                placeholder="Flat Number"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                className="border p-3 rounded"
              />

              <button
                type="submit"
                className="bg-black text-white py-3 rounded col-span-2"
              >
                Invite Admin
              </button>
            </form>
          )}

          {/* =============================
             BULK ADMIN MODE
          ============================= */}

          {mode === "bulk" && admins.length > 0 && (
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {admins.map((a, index) => (
                <div key={a.wing} className="border rounded-lg p-5 bg-gray-50">
                  <h3 className="font-semibold mb-3 text-lg">Wing {a.wing}</h3>

                  <input
                    placeholder="Admin Name"
                    value={a.name}
                    onChange={(e) =>
                      handleBulkChange(index, "name", e.target.value)
                    }
                    className="w-full border p-2 rounded mb-2"
                  />

                  <input
                    placeholder="Email"
                    value={a.email}
                    onChange={(e) =>
                      handleBulkChange(index, "email", e.target.value)
                    }
                    className="w-full border p-2 rounded mb-2"
                  />

                  <input
                    placeholder="Mobile"
                    value={a.mobile}
                    onChange={(e) =>
                      handleBulkChange(index, "mobile", e.target.value)
                    }
                    className="w-full border p-2 rounded mb-2"
                  />

                  <input
                    placeholder="Flat Number"
                    value={a.flatNo}
                    onChange={(e) =>
                      handleBulkChange(index, "flatNo", e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="bg-black text-white py-3 rounded col-span-2"
              >
                Create Wing Admins
              </button>
            </form>
          )}
        </div>

        {/* CREATE SOCIETY MODAL */}

        {showSocietyModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <CreateSocietyForm
                onSubmit={handleCreateSociety}
                loading={loading}
              />

              <button
                onClick={() => setShowSocietyModal(false)}
                className="mt-4 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </PageWrapper>
    </AppLayout>
  );

};

export default AddAdminWithSociety;