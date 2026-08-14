export default function Signup() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">

      <div className="card bg-base-100 shadow-xl w-full max-w-md">

        <div className="card-body">

          <h1 className="text-3xl font-bold text-center">
            Create Account
          </h1>

          <p className="text-center text-base-content/60 mb-4">
            Join the Nirapod Elaka community
          </p>

          <label className="label">
            <span className="label-text">Name</span>
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            className="input input-bordered w-full"
          />

          <label className="label mt-3">
            <span className="label-text">Email</span>
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
          />

          <label className="label mt-3">
            <span className="label-text">Password</span>
          </label>

          <input
            type="password"
            placeholder="Create a password"
            className="input input-bordered w-full"
          />

          <button className="btn btn-primary w-full mt-6">
            Sign Up
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="link link-primary">
              Log in
            </a>
          </p>

        </div>

      </div>

    </div>
  );
}