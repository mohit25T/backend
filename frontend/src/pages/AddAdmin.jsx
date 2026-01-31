import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../api/axios";

const AddAdmin = () => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState(""); // ✅ ADDED
  const [societyId, setSocietyId] = useState("");
  const [societies, setSocieties] = useState([]);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [flatNo, setFlatNo] = useState("");

  useEffect(() => {
    api.get("/societies").then((res) => setSocieties(res.data));
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();

    try {
      setMsg("");

      await api.post("/invites/admin", {
        name,
        mobile,
        email,      // ✅ ADDED
        societyId,
        flatNo,
      });

      setMsg("Admin invited successfully");

      // reset fields
      setName("");
      setMobile("");
      setEmail("");   // ✅ ADDED
      setSocietyId("");
      setFlatNo("");

    } catch (err) {
      setMsg(err.response?.data?.message || "Invite failed");
    }
  };

  return (
    <AppLayout>
      <PageWrapper>
        <h1 className="text-2xl font-bold mb-6">Add Admin</h1>

        <form
          onSubmit={handleInvite}
          className="bg-white p-6 rounded-xl shadow max-w-md space-y-4"
        >
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
            placeholder="Admin Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Flat Number (ex: A-101)"
            value={flatNo}
            onChange={(e) => setFlatNo(e.target.value.toUpperCase())}
            required
            className="w-full border p-2 rounded"
          />

          <select
            value={societyId}
            onChange={(e) => setSocietyId(e.target.value)}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Society</option>
            {societies.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Invite Admin
          </button>

          {msg && (
            <p className="text-sm text-center text-blue-600">{msg}</p>
          )}
        </form>
      </PageWrapper>
    </AppLayout>
  );
};

export default AddAdmin;
