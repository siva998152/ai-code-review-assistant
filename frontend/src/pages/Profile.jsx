import { useEffect, useState } from "react";
import {
  User,
  Mail,
  CalendarDays,
  Loader2,
  Pencil,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/authService";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        const profileUser = response.data.user;

        setUser(profileUser);

        setFormData({
          name: profileUser.name,
          email: profileUser.email,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleStartEditing = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });

    setEditing(true);
  };

  const handleCancelEditing = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });

    setEditing(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setSavingProfile(true);

      const response = await updateProfile({
        name,
        email,
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setEditing(false);

      toast.success(
        response.data.message ||
          "Profile updated successfully"
      );
    } catch (error) {
      console.error("Failed to update profile:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password"
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success(
        response.data.message ||
          "Password updated successfully"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2
              size={24}
              className="animate-spin"
            />

            <span className="font-medium">
              Loading profile...
            </span>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
          <p className="text-slate-600">
            Unable to load profile.
          </p>
        </main>
      </>
    );
  }

  const memberSince = new Date(
    user.created_at
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Account Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and manage your account information.
            </p>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <User
                    size={30}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {user.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    AI Code Review Assistant User
                  </p>
                </div>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <Pencil size={17} />

                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form
                onSubmit={handleSaveProfile}
                className="mt-6"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={savingProfile}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={savingProfile}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    disabled={savingProfile}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                  >
                    {savingProfile && (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {savingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <User size={18} />

                    <span className="text-sm font-medium">
                      Name
                    </span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {user.name}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={18} />

                    <span className="text-sm font-medium">
                      Email
                    </span>
                  </div>

                  <p className="mt-2 break-all font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarDays size={18} />

                    <span className="text-sm font-medium">
                      Member Since
                    </span>
                  </div>

                  <p className="mt-2 font-semibold text-slate-900">
                    {memberSince}
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3 border-b border-slate-200 pb-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <KeyRound
                  size={20}
                  className="text-violet-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the password used to access your account.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="mt-6"
            >
              <div className="grid gap-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium text-slate-700"
                  >
                    Current Password
                  </label>

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={changingPassword}
                    autoComplete="current-password"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-slate-700"
                    >
                      New Password
                    </label>

                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      disabled={changingPassword}
                      autoComplete="new-password"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-slate-700"
                    >
                      Confirm New Password
                    </label>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={changingPassword}
                      autoComplete="new-password"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
                >
                  {changingPassword && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {changingPassword
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default Profile;