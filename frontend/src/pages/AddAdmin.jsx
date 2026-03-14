import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../api/axios";

const AddAdminWithSociety = () => {

  const [mode, setMode] = useState("single");

  const [societies, setSocieties] = useState([]);
  const [societyId, setSocietyId] = useState("");
  const [wings, setWings] = useState([]);

  const [isNewSociety, setIsNewSociety] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [wing, setWing] = useState("");
  const [flatNo, setFlatNo] = useState("");

  const [admins, setAdmins] = useState([]);

  const [societyName, setSocietyName] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  /* =============================
     LOAD SOCIETIES
  ============================= */

  useEffect(() => {
    api.get("/societies").then((res) => {
      setSocieties(res.data);
    });
  }, []);

  /* =============================
     SOCIETY SELECT
  ============================= */

  const handleSocietyChange = (e) => {
    const value = e.target.value;

    setSocietyId(value);
    setIsNewSociety(value === "OTHER");

    if (value !== "OTHER") {
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
     SINGLE ADMIN WING INPUT
  ============================= */

  const handleWingInput = (value) => {
    const cleaned = value
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 1);

    setWing(cleaned);
  };

  /* =============================
     SUBMIT
  ============================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("");
    setLoading(true);

    try {
      let finalSocietyId = societyId;

      /* CREATE SOCIETY */

      if (isNewSociety) {
        const res = await api.post("/societies", {
          name: societyName,
          city,
        });

        finalSocietyId = res.data._id;
      }

      /* SINGLE ADMIN */

      if (mode === "single") {
        await api.post("/invites/admin", {
          name,
          mobile,
          email,
          wing,
          flatNo,
          societyId: finalSocietyId,
        });

        setMsg("Admin invited successfully");

        setName("");
        setMobile("");
        setEmail("");
        setWing("");
        setFlatNo("");
      } else {

      /* BULK ADMINS */
        const payload = admins.filter(
          (a) => a.name && a.mobile && a.email && a.flatNo,
        );

        if (payload.length === 0) {
          setMsg("Please fill at least one wing admin");
          setLoading(false);
          return;
        }

        await api.post("/invites/admin/bulk", {
          societyId: finalSocietyId,
          admins: payload,
        });

        setMsg("Wing admins invited successfully");

        setAdmins(
          admins.map((a) => ({
            ...a,
            name: "",
            email: "",
            mobile: "",
            flatNo: "",
          })),
        );
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
              className={`px-4 py-2 rounded ${
                mode === "single" ? "bg-black text-white" : "border"
              }`}
            >
              Single Admin
            </button>

            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`px-4 py-2 rounded ${
                mode === "bulk" ? "bg-black text-white" : "border"
              }`}
            >
              Wing-wise Setup
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow space-y-6"
          >
            {/* SOCIETY SELECT */}

            <select
              value={societyId}
              onChange={handleSocietyChange}
              required
              className="w-full border p-3 rounded"
            >
              <option value="">Select Society</option>

              {societies.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.city})
                </option>
              ))}

              <option value="OTHER">➕ Other (Create New Society)</option>
            </select>

            {/* NEW SOCIETY */}

            {isNewSociety && (
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Society Name"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  required
                  className="border p-3 rounded"
                />

                <input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border p-3 rounded"
                />
              </div>
            )}

            {/* SINGLE ADMIN */}

            {mode === "single" && (
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Admin Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border p-3 rounded"
                />

                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border p-3 rounded"
                />

                <input
                  type="text"
                  placeholder="Admin Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="border p-3 rounded"
                />

                {/* WING INPUT */}

                <input
                  type="text"
                  placeholder="Wing (A/B/C)"
                  value={wing}
                  onChange={(e) => handleWingInput(e.target.value)}
                  maxLength={1}
                  required
                  className="border p-3 rounded"
                />

                <input
                  type="text"
                  placeholder="Flat Number"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  required
                  className="border p-3 rounded"
                />
              </div>
            )}

            {/* BULK MODE */}

            {mode === "bulk" && admins.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {admins.map((a, index) => (
                  <div
                    key={a.wing}
                    className="border rounded-lg p-5 bg-gray-50"
                  >
                    <h3 className="font-semibold mb-3 text-lg">
                      Wing {a.wing}
                    </h3>

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
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Processing..." : "Submit"}
            </button>

            {msg && <p className="text-center text-sm text-blue-600">{msg}</p>}
          </form>
        </div>
      </PageWrapper>
    </AppLayout>
  );
};

export default AddAdminWithSociety;