// ============================================
// js/auth.js - Authentication Logic
// ============================================

const Auth = {

    async getSession() {
        const { data: { session } } = await db.auth.getSession();
        return session;
    },

    async getProfile(userId) {
        const { data, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async register(email, password, fullName) {
        const { data, error } = await db.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        return data;
    },

    async login(email, password) {
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    async logout() {
        await db.auth.signOut();
        window.location.href = 'index.html';
    },

    async requireAuth(redirectTo = 'index.html') {
        const session = await this.getSession();
        if (!session) { window.location.href = redirectTo; return null; }
        return session;
    },

    async requireGuest(redirectTo = 'dashboard.html') {
        const session = await this.getSession();
        if (session) window.location.href = redirectTo;
    },

    async requireAdmin() {
        const session = await this.requireAuth();
        if (!session) return null;
        const profile = await this.getProfile(session.user.id);
        if (profile.role !== 'admin') { window.location.href = 'dashboard.html'; return null; }
        return { session, profile };
    }
};
