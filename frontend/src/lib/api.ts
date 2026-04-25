const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      if (body?.detail) {
        message = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
      }
    } catch {
      // Ignore parse errors and keep fallback message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export type DnaQuestion = {
  question: string;
  options: string[];
  category: string;
};

export type DnaSubmitResponse = {
  level: string;
  accuracy: number;
  avg_time_per_question: number;
  profile: {
    learningStyle: string;
    strengths: string[];
    weaknesses: string[];
    level: string;
  };
};

export type RoadmapResponse = {
  roadmap_id: string;
  goal: string;
  roadmap: {
    phases: Array<{
      title: string;
      modules: string[];
    }>;
  };
};

export type CourseResponse = {
  course_id: string;
  module_name: string;
  roadmap_id: string;
  is_completed?: boolean;
  completed_at?: string | null;
  course: {
    title: string;
    lessons: Array<{
      type: string;
      content?: string | null;
      questions?: Array<Record<string, unknown>> | null;
    }>;
  };
};

export type UserCourse = {
  id: string;
  user_id: string;
  module_name: string;
  roadmap_id: string;
  created_at: string;
  is_completed?: boolean;
  completed_at?: string | null;
  course: CourseResponse["course"];
};

export type MentorMatch = {
  name: string;
  domain: string;
  email: string;
  match_score: number;
  skills?: string[];
  experience?: string;
  interests?: string[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  dna_profile?: Record<string, unknown> | null;
};

export type MentorshipSession = {
  _id: string;
  student_email: string;
  student_name: string;
  mentor_email: string;
  mentor_name: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  meeting_link?: string | null;
  created_at: string;
};

export const api = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ message: string; user: { id: string; name: string; email: string } }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  fetchMe: (token: string) =>
    request<UserProfile>("/auth/me", {
      token,
    }),
  fetchQuestions: (level: string) =>
    request<{ level: string; questions: DnaQuestion[] }>(`/dna/questions?level=${encodeURIComponent(level)}`),
  submitDna: (token: string, payload: { answers: string[]; time_taken: number[]; level: string }) =>
    request<DnaSubmitResponse>("/dna/submit", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  generateRoadmap: (token: string, payload: { goal: string; dna_profile?: Record<string, unknown> | null }) =>
    request<RoadmapResponse>("/roadmap/generate", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  generateCourse: (token: string, payload: { module_name: string; roadmap_id: string }) =>
    request<CourseResponse>("/course/generate", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  fetchMatchedMentors: (token: string) =>
    request<MentorMatch[]>("/mentors/matched", {
      token,
    }),
  fetchLatestRoadmap: (token: string) =>
    request<RoadmapResponse | { roadmap: null }>("/roadmap/latest", {
      token,
    }),
  fetchMyCourses: (token: string) =>
    request<{ courses: UserCourse[] }>("/course/my", {
      token,
    }),
  completeCourse: (
    token: string,
    payload: { course_id?: string; module_name?: string; roadmap_id?: string }
  ) =>
    request<{
      course_id: string;
      user_id: string;
      module_name: string;
      roadmap_id: string;
      is_completed: boolean;
      completed_at: string | null;
      created_at: string;
    }>("/course/complete", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  youtubeSearch: (payload: { query: string }) =>
    request<{ video_id: string; title?: string | null }>("/youtube/search", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  requestMentorship: (token: string, payload: { student_name: string; student_email: string; mentor_name: string; mentor_email: string; message: string }) =>
    request<{ message: string; status: string }>("/mentors/request", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),
  fetchMySessions: (token: string) =>
    request<MentorshipSession[]>("/mentors/sessions", {
      token,
    }),
};
