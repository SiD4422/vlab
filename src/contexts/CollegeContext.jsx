import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * CollegeContext
 * Reads the logged-in user's org_id from their user doc, then fetches
 * the matching organization document from the `organizations` collection.
 *
 * Provides: { orgName, deptName, logoUrl, subscriptionTier, orgId, loading }
 *
 * Falls back to SRM defaults so nothing breaks before backfill is run.
 */

const DEFAULTS = {
  orgId: 'srm_univ',
  orgName: 'SRM University',
  deptName: 'Dept. of Electrical Engineering',
  logoUrl: '/srm-logo-final.webp',
  subscriptionTier: 'campus',
};

const CollegeContext = createContext(DEFAULTS);

export function CollegeProvider({ children, user }) {
  const [college, setCollege] = useState({ ...DEFAULTS, loading: true });

  useEffect(() => {
    if (!user?.uid) {
      setCollege({ ...DEFAULTS, loading: false });
      return;
    }

    let cancelled = false;

    async function fetchOrgData() {
      try {
        // Step 1: get the user's org_id
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        const orgId = userSnap.exists() ? userSnap.data().org_id : null;

        if (!orgId) {
          // User doc exists but hasn't been backfilled yet — use defaults
          setCollege({ ...DEFAULTS, loading: false });
          return;
        }

        // Step 2: fetch the organization document
        const orgSnap = await getDoc(doc(db, 'organizations', orgId));

        if (!cancelled) {
          if (orgSnap.exists()) {
            const d = orgSnap.data();
            setCollege({
              orgId: d.org_id,
              orgName: d.org_name,
              deptName: d.dept_name,
              logoUrl: d.logo_url,
              subscriptionTier: d.subscription_tier,
              loading: false,
            });
          } else {
            setCollege({ ...DEFAULTS, loading: false });
          }
        }
      } catch (err) {
        console.error('[CollegeContext] Failed to fetch org data:', err);
        if (!cancelled) setCollege({ ...DEFAULTS, loading: false });
      }
    }

    fetchOrgData();
    return () => { cancelled = true; };
  }, [user?.uid]);

  return (
    <CollegeContext.Provider value={college}>
      {children}
    </CollegeContext.Provider>
  );
}

export function useCollege() {
  return useContext(CollegeContext);
}
