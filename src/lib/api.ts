// Backend API utilities for authentication and authorized requests
import type { User as DbUser } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://back.henriquefontaine.com';

const TOKEN_STORAGE_KEY = 'backend_token';

export type BackendToken = string;

export function getBackendToken(): BackendToken | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

export function setBackendToken(token: BackendToken): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (_) {
    // ignore storage errors
  }
}

export function clearBackendToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (_) {
    // ignore storage errors
  }
}

type ApiFetchOptions = RequestInit & { attachAuth?: boolean };

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  if (options.attachAuth) {
    const token = getBackendToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : (await response.text());

  if (!response.ok) {
    const message = isJson && data && (data.detail || data.message) ? (data.detail || data.message) : response.statusText;
    throw new Error(message || 'Erro na requisição');
  }

  return data as T;
}

// Auth to backend
export interface BackendLoginResponse {
  access_token: string;
  token_type: string;
}

export async function backendLogin(email: string): Promise<BackendLoginResponse> {
  const res = await apiFetch<BackendLoginResponse>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  setBackendToken(res.access_token);
  return res;
}

// Optional: register user in backend (usually unnecessary if DB is shared and the row already exists)
export interface BackendRegisterUser {
  id: string; // UUID
  email: string;
  name: string;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  birth_date?: string | null;
  phone?: string | null;
  is_connectable?: boolean;
  profile_visibility?: 'friends' | 'network' | 'public';
  auto_checkin_visibility?: 'public' | 'anonymous';
  allow_messages_from?: 'friends' | 'network' | 'everyone';
  review_delay?: 'immediate' | '1h' | '1d' | '7d';
  notifications_enabled?: boolean;
}

export async function backendRegister(user: BackendRegisterUser) {
  return apiFetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
}

export async function backendGetMe(): Promise<DbUser> {
  return apiFetch<DbUser>('/users/me', { attachAuth: true });
}

// Users
export async function getUser(userId: string): Promise<DbUser> {
  return apiFetch<DbUser>(`/users/${userId}`, { attachAuth: true });
}

export async function updateUser(userId: string, data: Partial<DbUser>): Promise<DbUser> {
  return apiFetch<DbUser>(`/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    attachAuth: true,
  });
}

export async function searchUsers(search: string): Promise<DbUser[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  return apiFetch<DbUser[]>(`/users?${params.toString()}`, { attachAuth: true });
}

export async function listUserFriends(userId: string): Promise<DbUser[]> {
  return apiFetch<DbUser[]>(`/users/${userId}/friends`, { attachAuth: true });
}

// Interests
export interface Interest {
  id: string;
  name: string;
  category?: string | null;
  icon?: string | null;
}

export async function listInterests(search?: string): Promise<Interest[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  return apiFetch<Interest[]>(`/interests?${params.toString()}`, { attachAuth: true });
}

export async function createInterest(name: string, category?: string, icon?: string): Promise<Interest> {
  return apiFetch<Interest>('/interests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, icon }),
    attachAuth: true,
  });
}

export async function getUserInterests(userId: string): Promise<Interest[]> {
  return apiFetch<Interest[]>(`/users/${userId}/interests`, { attachAuth: true });
}

export async function addUserInterest(userId: string, interestId: string): Promise<void> {
  await apiFetch<void>(`/users/${userId}/interests/${interestId}`, {
    method: 'POST',
    attachAuth: true,
  });
}

export async function removeUserInterest(userId: string, interestId: string): Promise<void> {
  await apiFetch<void>(`/users/${userId}/interests/${interestId}`, {
    method: 'DELETE',
    attachAuth: true,
  });
}

// Venues
export interface Venue {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  website?: string | null;
  hours?: string | null;
  price_range?: '$' | '$$' | '$$$' | '$$$$' | null;
  rating: number;
  total_reviews: number;
  image_url?: string | null;
  tags?: string[] | null;
  is_active: boolean;
}

export async function listVenues(params?: { search?: string; skip?: number; limit?: number; sort_by?: string; sort_order?: 'asc' | 'desc' }): Promise<Venue[]> {
  const usp = new URLSearchParams();
  if (params?.search) usp.set('search', params.search);
  if (params?.skip != null) usp.set('skip', String(params.skip));
  if (params?.limit != null) usp.set('limit', String(params.limit));
  if (params?.sort_by) usp.set('sort_by', params.sort_by);
  if (params?.sort_order) usp.set('sort_order', params.sort_order);
  const qs = usp.toString();
  return apiFetch<Venue[]>(`/venues${qs ? `?${qs}` : ''}`, { attachAuth: true });
}

export async function getVenue(venueId: string): Promise<Venue> {
  return apiFetch<Venue>(`/venues/${venueId}`, { attachAuth: true });
}

// Promotions
export interface Promotion {
  id: string;
  venue_id: string;
  title: string;
  description?: string | null;
  discount_percentage?: number | null;
  discount_amount?: number | null;
  min_purchase?: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export async function listVenuePromotions(venueId: string): Promise<Promotion[]> {
  return apiFetch<Promotion[]>(`/venues/${venueId}/promotions`, { attachAuth: true });
}

// Events
export interface EventItem {
  id: string;
  title: string;
  description?: string | null;
  venue_id?: string | null;
  group_id?: string | null;
  start_time: string;
  end_time?: string | null;
  max_attendees?: number | null;
  is_public: boolean;
}

export async function listEvents(params?: { skip?: number; limit?: number; group_id?: string; venue_id?: string }): Promise<EventItem[]> {
  const usp = new URLSearchParams();
  if (params?.skip != null) usp.set('skip', String(params.skip));
  if (params?.limit != null) usp.set('limit', String(params.limit));
  if (params?.group_id) usp.set('group_id', params.group_id);
  if (params?.venue_id) usp.set('venue_id', params.venue_id);
  const qs = usp.toString();
  return apiFetch<EventItem[]>(`/events${qs ? `?${qs}` : ''}`, { attachAuth: true });
}

// Notifications
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  is_read: boolean;
  created_at?: string | null;
}

export async function listNotifications(params?: { skip?: number; limit?: number }): Promise<Notification[]> {
  const usp = new URLSearchParams();
  if (params?.skip != null) usp.set('skip', String(params.skip));
  if (params?.limit != null) usp.set('limit', String(params.limit));
  const qs = usp.toString();
  return apiFetch<Notification[]>(`/notifications${qs ? `?${qs}` : ''}`, { attachAuth: true });
}

// Checkins
export interface CheckinCreate {
  user_id: string;
  venue_id: string;
  rating?: number | null;
  review?: string | null;
  amount_spent?: number | null;
  photos?: string[] | null;
  is_anonymous?: boolean;
}

export async function createCheckin(payload: CheckinCreate) {
  return apiFetch('/checkins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    attachAuth: true,
  });
}

export interface Checkin {
  id: string;
  user_id: string;
  venue_id: string;
  rating?: number | null;
  review?: string | null;
  amount_spent?: number | null;
  photos?: string[] | null;
  is_anonymous?: boolean;
  created_at?: string;
}

export async function listUserCheckins(userId: string, params?: { skip?: number; limit?: number }): Promise<Checkin[]> {
  const usp = new URLSearchParams();
  if (params?.skip != null) usp.set('skip', String(params.skip));
  if (params?.limit != null) usp.set('limit', String(params.limit));
  const qs = usp.toString();
  return apiFetch<Checkin[]>(`/users/${userId}/checkins${qs ? `?${qs}` : ''}`, { attachAuth: true });
}

export async function listVenueCheckins(venueId: string, params?: { skip?: number; limit?: number }): Promise<Checkin[]> {
  const usp = new URLSearchParams();
  if (params?.skip != null) usp.set('skip', String(params.skip));
  if (params?.limit != null) usp.set('limit', String(params.limit));
  const qs = usp.toString();
  return apiFetch<Checkin[]>(`/venues/${venueId}/checkins${qs ? `?${qs}` : ''}`, { attachAuth: true });
}

// Friendships
export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
}

export async function listIncomingFriendRequests(): Promise<Friendship[]> {
  return apiFetch<Friendship[]>(`/friendships/requests/incoming`, { attachAuth: true });
}

export async function listOutgoingFriendRequests(): Promise<Friendship[]> {
  return apiFetch<Friendship[]>(`/friendships/requests/outgoing`, { attachAuth: true });
}

// Groups
export interface GroupItem {
  id: string;
  name: string;
  description?: string | null;
  avatar_url?: string | null;
  radius_km?: number | null;
  is_public: boolean;
  max_members?: number | null;
  created_by?: string | null;
}

export async function listGroups(params?: { skip?: number; limit?: number; search?: string }): Promise<GroupItem[]> {
  const usp = new URLSearchParams();
  if (params?.skip != null) usp.set('skip', String(params.skip));
  if (params?.limit != null) usp.set('limit', String(params.limit));
  if (params?.search) usp.set('search', params.search);
  const qs = usp.toString();
  return apiFetch<GroupItem[]>(`/groups${qs ? `?${qs}` : ''}`, { attachAuth: true });
}

export interface GroupMemberItem {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at?: string | null;
}

export async function listGroupMembers(groupId: string): Promise<GroupMemberItem[]> {
  return apiFetch<GroupMemberItem[]>(`/groups/${groupId}/members`, { attachAuth: true });
}

// Messages
export interface MessageItem {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at?: string | null;
}

export interface MessageThreadItem {
  user_id: string;
  last_message: MessageItem;
  unread_count: number;
}

export async function listMessageThreads(): Promise<MessageThreadItem[]> {
  return apiFetch<MessageThreadItem[]>(`/messages/threads`, { attachAuth: true });
}

export async function listMessagesWith(userId: string, params?: { skip?: number; limit?: number }): Promise<MessageItem[]> {
  const usp = new URLSearchParams();
  if (params?.skip != null) usp.set('skip', String(params.skip));
  if (params?.limit != null) usp.set('limit', String(params.limit));
  const qs = usp.toString();
  return apiFetch<MessageItem[]>(`/messages/with/${userId}${qs ? `?${qs}` : ''}`, { attachAuth: true });
}

export async function createMessage(toUserId: string, content: string): Promise<MessageItem> {
  return apiFetch<MessageItem>(`/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiver_id: toUserId, content }),
    attachAuth: true,
  });
}

