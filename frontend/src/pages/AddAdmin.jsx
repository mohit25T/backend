import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import CreateSocietyForm from "../components/societies/CreateSocietyForm";
import api from "../api/axios";
import { UserPlus, Building, Mail, Phone, Hash, Layers } from "lucide-react";

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
    try {
      const res = await api.get("/societies");
      setSocieties(res.data);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load societies");
    }
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

    // reset previous data
    setWings([]);
    setAdmins([]);
    setWing("");

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
  };

  /* =============================
     CREATE SOCIETY
  ============================= */

  const handleCreateSociety = async (data) => {
    try {
      setLoading(true);

      const res = await api.post("/societies", data);
      const newSociety = res.data;

      await loadSocieties();

      setSocietyId(newSociety._id);

      const wingsData = newSociety.wings || [];

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

      setShowSocietyModal(false);
      setMsg("Society created successfully");

    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Failed to create society");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     BULK ADMIN FIELD CHANGE
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

    if (!societyId) {
      setMsg("Please select a society");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      if (mode === "single") {

        // ✅ extra validation (safe)
        if (!name || !mobile || !email || !wing || !flatNo) {
          setMsg("All fields are required");
          setLoading(false);
          return;
        }

        await api.post("/invites/admin", {
          name,
          mobile,
          email,
          wing,
          flatNo,
          societyId
        });

        setMsg("Admin invited successfully");

        setName("");
        setMobile("");
        setEmail("");
        setWing("");
        setFlatNo("");

      } else {

        const payload = admins.filter(
          (a) => a.name && a.mobile && a.email && a.flatNo
        );

        if (payload.length === 0) {
          setMsg("Please fill at least one wing admin");
          setLoading(false);
          return;
        }

        await api.post("/invites/admin/bulk", {
          societyId,
          admins: payload
        });

        setMsg("Wing admins invited successfully");

        setAdmins(
          admins.map((a) => ({
            ...a,
            name: "",
            email: "",
            mobile: "",
            flatNo: ""
          }))
        );
      }

    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (

    <AppLayout>
      <PageWrapper>

        <div className="max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-primary-400" />
              Add Admin
            </h1>
            <p className="text-gray-400 mt-2">
              Invite new administrators to manage societies and wings.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl relative">

            {msg && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                msg.toLowerCase().includes("success") || msg.toLowerCase().includes("invited")
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
                {msg}
              </div>
            )}

            {/* EVERYTHING BELOW = SAME (UNCHANGED UI) */}

            {/* MODE SWITCH */}
            <div className="flex bg-dark-800/50 p-1.5 rounded-xl border border-white/5 w-fit mb-8 shadow-inner">
              <button
                type="button"
                onClick={() => setMode("single")}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                  mode === "single"
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                Single Admin
              </button>

              <button
                type="button"
                onClick={() => setMode("bulk")}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                  mode === "bulk"
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                Wing-wise Setup
              </button>
            </div>

           
            {/* SOCIETY SELECT */}
            <div className="mb-8 relative group">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors pointer-events-none" />
              <select
                value={societyId}
                onChange={handleSocietyChange}
                className="glass-input pl-12 text-gray-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat"
              >
                <option value="" className="bg-dark-900 text-gray-400">Select Society</option>

                {societies.map((s) => (
                  <option key={s._id} value={s._id} className="bg-dark-900 text-gray-100">
                    {s.name} ({s.city})
                  </option>
                ))}

                <option value="OTHER" className="bg-primary-900 text-primary-100 font-medium">
                  ➕ Other (Create New Society)
                </option>
              </select>
            </div>

            {/* =============================
               SINGLE ADMIN MODE
            ============================= */}

            {mode === "single" && (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                
                <div className="relative group">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    placeholder="Admin Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="glass-input pl-12"
                    required
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="glass-input pl-12"
                    required
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    type="tel"
                    placeholder="Admin Mobile"
                    value={mobile}
                    onChange={(e)=>setMobile(e.target.value)}
                    className="glass-input pl-12"
                    required
                  />
                </div>

                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors pointer-events-none" />
                  <select
                    value={wing}
                    onChange={(e)=>setWing(e.target.value)}
                    disabled={!societyId || wings.length === 0}
                    className="glass-input pl-12 text-gray-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat disabled:opacity-50"
                    required
                  >
                    <option value="" className="bg-dark-900 text-gray-400">Select Wing</option>
                    {wings.map((w)=>(
                      <option key={w} value={w} className="bg-dark-900 text-gray-100">Wing {w}</option>
                    ))}
                  </select>
                </div>

                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    placeholder="Flat Number"
                    value={flatNo}
                    onChange={(e)=>setFlatNo(e.target.value)}
                    className="glass-input pl-12"
                    required
                  />
                </div>

                <div className="md:col-span-2 mt-4 pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? "Sending Invite..." : "Invite Admin"}
                  </button>
                </div>

              </form>

            )}

            {/* =============================
               BULK ADMIN MODE
            ============================= */}

            {mode === "bulk" && admins.length > 0 && (

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

                {admins.map((a,index)=>(
                  <div key={a.wing} className="glass-light rounded-xl p-5 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                    
                    {/* decorative background glow */}
                    <div className="absolute -inset-8 bg-primary-500/0 group-hover:bg-primary-500/5 blur-xl transition-all duration-500 z-0 pointer-events-none" />

                    <h3 className="font-semibold mb-4 text-lg text-primary-300 flex items-center gap-2 relative z-10">
                      <Layers className="w-5 h-5" />
                      Wing {a.wing}
                    </h3>

                    <div className="space-y-3 relative z-10">
                      <div className="relative group/input">
                        <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-primary-400 transition-colors" />
                        <input
                          placeholder="Admin Name"
                          value={a.name}
                          onChange={(e)=>handleBulkChange(index,"name",e.target.value)}
                          className="glass-input pl-10 py-2 text-sm"
                        />
                      </div>

                      <div className="relative group/input">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-primary-400 transition-colors" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={a.email}
                          onChange={(e)=>handleBulkChange(index,"email",e.target.value)}
                          className="glass-input pl-10 py-2 text-sm"
                        />
                      </div>

                      <div className="relative group/input">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-primary-400 transition-colors" />
                        <input
                          type="tel"
                          placeholder="Mobile"
                          value={a.mobile}
                          onChange={(e)=>handleBulkChange(index,"mobile",e.target.value)}
                          className="glass-input pl-10 py-2 text-sm"
                        />
                      </div>

                      <div className="relative group/input">
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-primary-400 transition-colors" />
                        <input
                          placeholder="Flat Number"
                          value={a.flatNo}
                          onChange={(e)=>handleBulkChange(index,"flatNo",e.target.value)}
                          className="glass-input pl-10 py-2 text-sm"
                        />
                      </div>
                    </div>

                  </div>
                ))}

                <div className="md:col-span-2 mt-4 pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? "Processing..." : "Create Wing Admins"}
                  </button>
                </div>

              </form>

            )}

          </div>
        </div>

        {/* CREATE SOCIETY MODAL */}

        {showSocietyModal && (
          <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative border-white/20">
              
              <h2 className="text-xl font-bold text-white mb-6">Create New Society</h2>

              <CreateSocietyForm
                onSubmit={handleCreateSociety}
                loading={loading}
              />

              <button
                onClick={()=>setShowSocietyModal(false)}
                className="mt-6 text-sm text-gray-400 hover:text-white transition-colors w-full text-center"
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