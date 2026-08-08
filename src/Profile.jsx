import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './services/firebase';
import { User, Settings, Save, Loader2, Building, Hash, GraduationCap, LogOut, Award, CheckCircle, Zap, Camera } from 'lucide-react';
import { auth } from './services/firebase';
import { signOut } from 'firebase/auth';

const C = {
  shell: "var(--shell)",
  shellSoft: "var(--shellSoft)",
  canvas: "var(--canvas)",
  card: "var(--card)",
  copper: "var(--copper)",
  copperDark: "var(--copperDark)",
  teal: "var(--teal)",
  ink: "var(--ink)",
  muted: "var(--muted)",
  border: "var(--border)",
  primary: "var(--copper)",
  text: "var(--ink)",
  textMuted: "var(--muted)",
  bgCard: "var(--card)",
  bgLighter: "var(--canvas)"
};

export default function Profile({ user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    registrationNo: '',
    department: '',
    section: ''
  });
  const [message, setMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(prev => ({
            ...prev,
            name: data.name || user.name || '',
            registrationNo: data.registrationNo || '',
            department: data.department || '',
            section: data.section || ''
          }));
        }
      } catch (err) {
        console.error("Failed to load profile in background", err);
      }
    }
    loadProfile();
  }, [user.uid]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const docRef = doc(db, 'users', user.uid);
      
      const updatePayload = {
        name: profileData.name,
        department: profileData.department,
        role: user.role
      };
      
      if (user.role === 'student') {
        updatePayload.registrationNo = profileData.registrationNo;
        updatePayload.section = profileData.section;
      }
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: Could not connect to database")), 8000)
      );
      
      await Promise.race([
        setDoc(docRef, updatePayload, { merge: true }),
        timeoutPromise
      ]);
      
      setMessage('Profile updated successfully!');
      if (onUpdate) onUpdate({ ...user, name: profileData.name });
    } catch (err) {
      console.error("Update failed", err);
      setMessage(err.message === "Timeout: Could not connect to database" 
        ? "Network Error: An adblocker, VPN, or firewall is blocking the database connection."
        : "Failed to update profile. Ensure you have permission.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large (max 5MB)");
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 256;
          const MAX_HEIGHT = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Compress image to JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

          // Save to Firestore
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, { avatar: dataUrl }, { merge: true });

          // Update global state
          if (onUpdate) onUpdate({ ...user, avatar: dataUrl });
          setMessage("Profile image updated successfully!");
          setUploadingImage(false);
        };
      };
    } catch (err) {
      console.error("Image upload failed", err);
      setMessage("Failed to update profile image.");
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader2 className="spin" /></div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
        
        <div 
          onClick={() => !uploadingImage && fileInputRef.current?.click()}
          style={{ position: 'relative', width: 80, height: 80, borderRadius: 40, border: `2px solid ${C.border}`, cursor: 'pointer', overflow: 'hidden', background: C.canvas }}
          title="Change Profile Picture"
        >
          {uploadingImage ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
              <Loader2 className="spin" size={24} color="#fff" />
            </div>
          ) : (
            <>
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '4px', display: 'flex', justifyContent: 'center' }}>
                <Camera size={14} color="#fff" />
              </div>
            </>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>

        <div>
          <h2 style={{ margin: '0 0 8px', fontSize: 28, color: C.ink }}>{profileData.name}</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ padding: '4px 12px', background: user.role === 'teacher' ? C.copper : C.teal, color: '#fff', borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>
              {user.role}
            </span>
            <span style={{ color: C.muted, fontSize: 14 }}>{user.email}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={() => signOut(auth)}
            style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#ef4444', border: '1px solid rgba(220, 38, 38, 0.2)', padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 30, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 18, color: C.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={20} /> Profile Details
        </h3>
        
        {message && (
          <div style={{ padding: '12px 16px', background: message.includes('success') ? 'rgba(31, 122, 114, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: message.includes('success') ? C.teal : '#ef4444', borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: C.muted }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="name" value={profileData.name} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.canvas, color: C.ink, boxSizing: 'border-box' }} required />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: C.muted }}>Email Address</label>
              <input type="email" value={profileData.email} disabled style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.05)', color: C.muted, boxSizing: 'border-box', cursor: 'not-allowed' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: C.muted }}>Department</label>
              <div style={{ position: 'relative' }}>
                <Building size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="department" value={profileData.department} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.canvas, color: C.ink, boxSizing: 'border-box' }} placeholder="e.g. Electrical Engineering" />
              </div>
            </div>

            {user.role === 'student' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: C.muted }}>Registration Number</label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" name="registrationNo" value={profileData.registrationNo} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.canvas, color: C.ink, boxSizing: 'border-box' }} placeholder="e.g. 2024ECE001" />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: C.muted }}>Section</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" name="section" value={profileData.section} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.canvas, color: C.ink, boxSizing: 'border-box' }} placeholder="e.g. A" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="submit" disabled={loading || saving} style={{ background: C.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: (loading || saving) ? 'not-allowed' : 'pointer', opacity: (loading || saving) ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: C.bgCard, borderRadius: 12, padding: 32, border: `1px solid ${C.border}`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'rgba(217, 119, 6, 0.1)', color: C.primary, padding: 10, borderRadius: 10 }}>
            <Award size={24} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Achievements & Progress</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: C.bgLighter, padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: `1px solid ${C.border}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <CheckCircle size={24} />
            </div>
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: C.text }}>First Steps</h4>
            <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Completed first experiment</p>
          </div>
          <div style={{ background: C.bgLighter, padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: `1px solid ${C.border}`, opacity: 0.5 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Award size={24} />
            </div>
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: C.text }}>Bridge Master</h4>
            <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Complete all AC/DC bridges</p>
          </div>
          <div style={{ background: C.bgLighter, padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: `1px solid ${C.border}`, opacity: 0.5 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Zap size={24} />
            </div>
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: C.text }}>Flawless Viva</h4>
            <p style={{ margin: 0, fontSize: '12px', color: C.textMuted }}>Score 100% on AI Examiner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
