export default function Login() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">

      <div className="card bg-base-100 shadow-xl w-full max-w-md">

        <div className="card-body">

          <h1 className="text-3xl font-bold text-center">
            Welcome Back
          </h1>

          <p className="text-center text-base-content/60 mb-4">
            Log in to your Nirapod Elaka account
          </p>

          <label className="label">
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
            placeholder="Enter your password"
            className="input input-bordered w-full"
          />

          <button className="btn btn-primary w-full mt-6">
            Log In
          </button>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" className="link link-primary">
              Sign up
            </a>
          </p>

        </div>

      </div>

    </div>
  );
}