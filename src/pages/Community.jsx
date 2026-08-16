export default function Community() {
  return (
   <div className="min-h-screen bg-base-200 px-6 pt-24 pb-10"> 
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-4">
          Community
        </h1>

        <p className="text-base-content/70 mb-8">
          See how the community is helping make areas safer.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">
                Total Reports
              </h2>

              <p className="text-4xl font-bold">
                0
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">
                Safe Areas
              </h2>

              <p className="text-4xl font-bold">
                0
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">
                Active Users
              </h2>

              <p className="text-4xl font-bold">
                0
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}