export type AvatarGender = "female" | "male" | "neutral";
export type AvatarAgeGroup = "young" | "adult" | "senior";

export interface AvatarPersona {
  id: string;
  name: string;
  image: string;
  accent: string;
  gender: AvatarGender;
  ageGroup: AvatarAgeGroup;
}

export const AVATAR_PERSONAS: AvatarPersona[] = [
  {
    id: "aanya",
    name: "Dr. Aanya",
    image: "/avatars/woman-health-worker-1.png",
    accent: "#14b8a6",
    gender: "female",
    ageGroup: "adult",
  },
  {
    id: "priya",
    name: "Dr. Priya",
    image: "/avatars/woman-health-worker-2.png",
    accent: "#ec4899",
    gender: "female",
    ageGroup: "adult",
  },
  {
    id: "rohan",
    name: "Dr. Rohan",
    image: "/avatars/man-health-worker-1.png",
    accent: "#6366f1",
    gender: "male",
    ageGroup: "adult",
  },
  {
    id: "arjun",
    name: "Dr. Arjun",
    image: "/avatars/man-health-worker-2.png",
    accent: "#22c55e",
    gender: "male",
    ageGroup: "adult",
  },
  {
    id: "meera",
    name: "Dr. Meera",
    image: "/avatars/old-woman.png",
    accent: "#f59e0b",
    gender: "female",
    ageGroup: "senior",
  },
  {
    id: "vikram",
    name: "Dr. Vikram",
    image: "/avatars/old-man.png",
    accent: "#64748b",
    gender: "male",
    ageGroup: "senior",
  },
  {
    id: "sam",
    name: "Sam",
    image: "/avatars/health-worker-neutral.png",
    accent: "#0ea5e9",
    gender: "neutral",
    ageGroup: "adult",
  },
  {
    id: "zara",
    name: "Zara",
    image: "/avatars/young-woman.png",
    accent: "#a855f7",
    gender: "female",
    ageGroup: "young",
  },
];

export const DEFAULT_PERSONA_ID = AVATAR_PERSONAS[0].id;

export function getPersonaAvatarUri(personaId: string): string {
  return (AVATAR_PERSONAS.find((p) => p.id === personaId) ?? AVATAR_PERSONAS[0]).image;
}

export function getPersonaAccent(personaId: string): string {
  return (AVATAR_PERSONAS.find((p) => p.id === personaId) ?? AVATAR_PERSONAS[0]).accent;
}

export function getPersona(personaId: string): AvatarPersona {
  return AVATAR_PERSONAS.find((p) => p.id === personaId) ?? AVATAR_PERSONAS[0];
}

/** Orders personas so ones matching the given gender/age come first, without hiding the rest. */
export function sortPersonasByPreference(
  gender: AvatarGender | null,
  ageGroup: AvatarAgeGroup | null
): AvatarPersona[] {
  const score = (p: AvatarPersona) => {
    let s = 0;
    if (gender && p.gender === gender) s += 2;
    if (ageGroup && p.ageGroup === ageGroup) s += 1;
    return -s;
  };
  return [...AVATAR_PERSONAS].sort((a, b) => score(a) - score(b));
}
