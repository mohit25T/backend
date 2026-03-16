import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageWrapper from "../components/layout/PageWrapper";
import { globalSearch } from "../api/search";
import { Search, User, Building, MapPin, Phone, Mail, Hash } from "lucide-react";

const GlobalSearch = () => {
  const [q, setQ] = useState("");
  const [result, setResult] = useState({
    users: [],
    societies: []
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (q.length < 2) {
      setResult({ users: [], societies: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      globalSearch(q).then((res) => {
        setResult(res.data)
        setIsSearching(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [q]);

  return (
    <AppLayout>
      <PageWrapper>

        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight flex items-center gap-3">
              <Search className="w-8 h-8 text-primary-400" />
              Global Search
            </h1>
            <p className="text-gray-400 mt-2">Find users, societies, and admins across the entire network.</p>
          </div>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Start typing to search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="glass-input pl-16 py-4 text-lg w-full bg-dark-900/40 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl focus:bg-dark-900/60 transition-all font-medium placeholder-gray-600"
            />
            {isSearching && (
               <div className="absolute right-6 top-1/2 -translate-y-1/2">
                 <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
               </div>
            )}
          </div>

          <div className="space-y-6">
            {/* USERS */}
            {result.users.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  Users <span className="text-sm font-normal text-gray-500 px-2 py-0.5 bg-dark-800 rounded-full">{result.users.length}</span>
                </h2>

                <ul className="divide-y divide-white/5">
                  {result.users.map((u) => (
                    <li key={u._id} className="py-4 first:pt-0 last:pb-0 group hover:bg-white/[0.02] -mx-4 px-4 transition-colors rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        <div>
                          <p className="font-semibold text-gray-200 text-lg flex items-center gap-2">
                            {u.name || "—"} 
                            <span className="flex gap-1">
                              {u.roles.map(r => (
                                <span key={r} className="text-[10px] px-1.5 py-0.5 bg-primary-500/20 text-primary-300 rounded font-medium tracking-wider uppercase">{r}</span>
                              ))}
                            </span>
                          </p>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-gray-500" /> {u.societyId?.name || "-"}</span>
                            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-gray-500" /> Wing {u.wing || "-"}</span>
                            <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-gray-500" /> Flat {u.flatNo || "-"}</span>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 text-sm text-gray-400 sm:text-right">
                          <span className="flex items-center gap-1.5 justify-end"><Mail className="w-4 h-4 text-gray-500" /> {u.email || "-"}</span>
                          <span className="flex items-center gap-1.5 justify-end"><Phone className="w-4 h-4 text-gray-500" /> {u.mobile}</span>
                        </div>

                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SOCIETIES */}
            {result.societies.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 border border-white/5">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-400" />
                  Societies <span className="text-sm font-normal text-gray-500 px-2 py-0.5 bg-dark-800 rounded-full">{result.societies.length}</span>
                </h2>

                <ul className="grid sm:grid-cols-2 gap-4">
                  {result.societies.map((s) => (
                    <li key={s._id} className="p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-white/10 transition-colors">
                      <p className="font-semibold text-gray-200 text-lg mb-1">
                        {s.name}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-500" />{s.city}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                            s.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                            {s.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {q.length >= 2 && !isSearching && result.users.length === 0 && result.societies.length === 0 && (
              <div className="glass-panel p-12 rounded-2xl text-center border border-white/5">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300">No results found</h3>
                <p className="text-gray-500 mt-2">We couldn't find any users or societies matching "{q}"</p>
              </div>
            )}
            
          </div>

        </div>

      </PageWrapper>
    </AppLayout>
  );
};

export default GlobalSearch;