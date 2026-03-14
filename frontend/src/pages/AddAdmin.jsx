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

  useEffect(() => {
    api.get("/societies").then((res) => setSocieties(res.data));
  }, []);

  const handleSocietyChange = (e) => {
    const value = e.target.value;

    setSocietyId(value);
    setIsNewSociety(value === "OTHER");

    if (value !== "OTHER") {
      const society = societies.find((s) => s._id === value);
      const wingsData = society?.wings || [];

      setWings(wingsData);

      setAdmins(
        wingsData.map((w) => ({
          wing: w,
          name: "",
          email: "",
          mobile: "",
          flatNo: ""
        }))
      );
    }
  };

  const handleBulkChange = (index, field, value) => {
    const updated = [...admins];
    updated[index][field] = value;
    setAdmins(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMsg("");
    setLoading(true);

    try {

      let finalSocietyId = societyId;

      if (isNewSociety) {
        const res = await api.post("/societies", {
          name: societyName,
          city
        });

        finalSocietyId = res.data._id;
      }

      if (mode === "single") {

        await api.post("/invites/admin", {
          name,
          mobile,
          email,
          wing,
          flatNo,
          societyId: finalSocietyId
        });

        setMsg("Admin invited successfully");

      } else {

        const payload = admins
          .filter((a) => a.name && a.mobile && a.email && a.flatNo)
          .map((a) => ({
            ...a
          }));

        await api.post("/invites/admin/bulk", {
          societyId: finalSocietyId,
          admins: payload
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

        <div className="max-w-xl mx-auto">

          <h1 className="text-2xl font-bold mb-4">
            Add Admin
          </h1>

          {/* MODE SWITCH */}

          <div className="flex gap-4 mb-6">

            <button
              onClick={() => setMode("single")}
              className={`px-3 py-1 rounded ${
                mode === "single" ? "bg-black text-white" : "border"
              }`}
            >
              Single Admin
            </button>

            <button
              onClick={() => setMode("bulk")}
              className={`px-3 py-1 rounded ${
                mode === "bulk" ? "bg-black text-white" : "border"
              }`}
            >
              Wing-wise Setup
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >

            {/* SOCIETY */}

            <select
              value={societyId}
              onChange={handleSocietyChange}
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Society</option>

              {societies.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.city})
                </option>
              ))}

              <option value="OTHER">
                ➕ Other (Create New Society)
              </option>

            </select>

            {mode === "single" && (

              <>
                <input
                  type="text"
                  placeholder="Admin Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border p-2 rounded"
                />

                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border p-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Admin Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full border p-2 rounded"
                />

                <select
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Wing</option>

                  {wings.map((w) => (
                    <option key={w} value={w}>
                      Wing {w}
                    </option>
                  ))}

                </select>

                <input
                  type="text"
                  placeholder="Flat Number"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  required
                  className="w-full border p-2 rounded"
                />

              </>
            )}

            {mode === "bulk" && (

              <div className="space-y-6">

                {admins.map((a, index) => (

                  <div key={a.wing} className="border p-4 rounded">

                    <h3 className="font-semibold mb-2">
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
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? "Processing..." : "Submit"}
            </button>

            {msg && (
              <p className="text-center text-sm text-blue-600">
                {msg}
              </p>
            )}

          </form>

        </div>

      </PageWrapper>
    </AppLayout>
  );
};

export default AddAdminWithSociety;