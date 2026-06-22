import type { Profile } from "./types";

export const profile = $state({
  profile: null as Profile | null,
  session_key: null as string | null,
});

export function setProfile(newProfile: Profile) {
  profile.profile = newProfile;
}

export function getProfileInSessionStorage() {
  const profile = sessionStorage.getItem("fm_user_profile");

  if (!profile) return null;

  return JSON.parse(profile) as Profile;
}

export function setProfileInSessionStorage(profile: Profile) {
  sessionStorage.setItem("fm_user_profile", JSON.stringify(profile));
}
