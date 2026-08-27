import { NavLink } from 'react-router';
export default function Community() {

  const reports = [
    {
      type: "Theft",
      location: "Banani DOHS, Dhaka",
      time: "2 hours ago",
      description:
        "A theft was reported near the main road. Residents are advised to stay alert.",
      rating: 2,
      status: "Danger",
    },

    {
      type: "Street Light Problem",
      location: "Mirpur 10, Dhaka",
      time: "5 hours ago",
      description:
        "Several street lights are not working properly, making the area darker at night.",
      rating: 3,
      status: "Caution",
    },

    {
      type: "Vandalism",
      location: "Gulshan-2, Dhaka",
      time: "8 hours ago",
      description:
        "Property damage was reported near a public area. The community has been notified.",
      rating: 3,
      status: "Caution",
    },

    {
      type: "Safe Area",
      location: "Dhanmondi 27, Dhaka",
      time: "Yesterday",
      description:
        "This area has good lighting and regular community activity, making it relatively safe.",
      rating: 5,
      status: "Safe",
    },

    {
      type: "Suspicious Activity",
      location: "Mohammadpur, Dhaka",
      time: "Yesterday",
      description:
        "Residents reported suspicious activity in the area during the evening.",
      rating: 2,
      status: "Danger",
    },

    {
      type: "Harassment",
      location: "Uttara Sector 7, Dhaka",
      time: "2 days ago",
      description:
        "A harassment incident was reported near a busy intersection.",
      rating: 2,
      status: "Danger",
    },
  ];


  return (

    <div className="min-h-screen bg-[#10151f] text-[#e9ecf3] px-6 pt-24 pb-16">

      <div className="max-w-6xl mx-auto">


        {/* PAGE HEADER */}

        <div className="text-center mb-10">

          <p className="text-[#f5a623] text-sm font-semibold tracking-widest mb-3">
            COMMUNITY
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Community Safety Reports
          </h1>

          <p className="text-[#9aa4ba] max-w-2xl mx-auto">
            See what people around the community are reporting and help make
            your neighbourhood safer.
          </p>

        </div>


        {/* SEARCH BAR */}

        <div className="mb-8">

          <div className="max-w-3xl mx-auto">

            <div className="flex items-center bg-[#171e2c] border border-[#2b3548] rounded-xl px-4 py-3">

              <span className="text-xl mr-3">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search reports, locations or incidents..."
                className="w-full bg-transparent outline-none text-[#e9ecf3] placeholder:text-[#68738a]"
              />

            </div>

          </div>

        </div>


        {/* FILTER BUTTONS */}

        <div className="flex flex-wrap justify-center gap-3 mb-10">

          <button className="px-4 py-2 rounded-lg bg-[#f5a623] text-[#10151f] font-semibold">
            All Reports
          </button>

          <button className="px-4 py-2 rounded-lg bg-[#171e2c] border border-[#2b3548] text-[#9aa4ba] hover:text-[#e9ecf3]">
            Safe
          </button>

          <button className="px-4 py-2 rounded-lg bg-[#171e2c] border border-[#2b3548] text-[#9aa4ba] hover:text-[#e9ecf3]">
            Caution
          </button>

          <button className="px-4 py-2 rounded-lg bg-[#171e2c] border border-[#2b3548] text-[#9aa4ba] hover:text-[#e9ecf3]">
            Danger
          </button>

          <button className="px-4 py-2 rounded-lg bg-[#171e2c] border border-[#2b3548] text-[#9aa4ba] hover:text-[#e9ecf3]">
            Recent
          </button>

        </div>


        {/* STATISTICS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">


          <div className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6">

            <p className="text-[#9aa4ba] text-sm mb-2">
              Total Reports
            </p>

            <h2 className="text-4xl font-bold text-[#e9ecf3]">
              1,248
            </h2>

            <p className="text-[#3ecf8e] text-sm mt-2">
              ↑ 12% this month
            </p>

          </div>


          <div className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6">

            <p className="text-[#9aa4ba] text-sm mb-2">
              Safe Areas
            </p>

            <h2 className="text-4xl font-bold text-[#3ecf8e]">
              486
            </h2>

            <p className="text-[#9aa4ba] text-sm mt-2">
              Community confirmed
            </p>

          </div>


          <div className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6">

            <p className="text-[#9aa4ba] text-sm mb-2">
              Active Contributors
            </p>

            <h2 className="text-4xl font-bold text-[#f5a623]">
              532
            </h2>

            <p className="text-[#9aa4ba] text-sm mt-2">
              Helping their communities
            </p>

          </div>

        </div>


        {/* RECENT REPORTS TITLE */}

        <div className="mb-6">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">

            <div>

              <p className="text-[#f5a623] text-sm font-semibold tracking-widest mb-2">
                RECENT ACTIVITY
              </p>

              <h2 className="text-3xl font-bold">
                Community Reports
              </h2>

            </div>

            <p className="text-[#68738a] text-sm">
              Showing recent reports
            </p>

          </div>

        </div>


        {/* REPORT CARDS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {reports.map((report, index) => (

            <div
              key={index}
              className="bg-[#171e2c] border border-[#2b3548] rounded-2xl p-6 hover:border-[#f5a623] transition"
            >


              {/* REPORT TOP */}

              <div className="flex items-start justify-between gap-4 mb-4">

                <div>

                  <div className="flex items-center gap-3 mb-2">

                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          report.status === "Safe"
                            ? "#3ecf8e"
                            : report.status === "Caution"
                            ? "#f5a623"
                            : "#ef4f4f",
                      }}
                    ></span>

                    <h3 className="text-xl font-bold">
                      {report.type}
                    </h3>

                  </div>

                  <p className="text-[#9aa4ba] text-sm">
                    📍 {report.location}
                  </p>

                </div>

                <span className="text-[#68738a] text-sm whitespace-nowrap">
                  {report.time}
                </span>

              </div>


              {/* REPORT DESCRIPTION */}

              <p className="text-[#9aa4ba] leading-6 mb-5">
                {report.description}
              </p>


              {/* REPORT BOTTOM */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-[#2b3548] pt-4">

                <div>

                  <p
                    className="text-sm font-semibold"
                    style={{
                      color:
                        report.status === "Safe"
                          ? "#3ecf8e"
                          : report.status === "Caution"
                          ? "#f5a623"
                          : "#ef4f4f",
                    }}
                  >
                    {report.status}
                  </p>

                  <p
                    className="text-lg tracking-widest"
                    style={{
                      color:
                        report.status === "Safe"
                          ? "#3ecf8e"
                          : report.status === "Caution"
                          ? "#f5a623"
                          : "#ef4f4f",
                    }}
                  >
                    {"★".repeat(report.rating)}
                    {"☆".repeat(5 - report.rating)}
                  </p>

                </div>


                <button className="px-4 py-2 rounded-lg border border-[#2b3548] text-[#e9ecf3] hover:bg-[#1f2838] transition">
                  View Report →
                </button>

              </div>

            </div>

          ))}

        </div>


        {/* BOTTOM CTA */}

        <div className="mt-12 bg-[#171e2c] border border-[#2b3548] rounded-2xl p-8 text-center">

          <h2 className="text-2xl font-bold mb-3">
            Help make your neighbourhood safer.
          </h2>

          <p className="text-[#9aa4ba] mb-6 max-w-xl mx-auto">
            Share what you see around you and help other people make safer
            decisions.
          </p>

          <NavLink to="/login" className="inline-block px-6 py-3 rounded-lg bg-[#f5a623] text-[#10151f] font-bold hover:opacity-90 transition">
              Start Reporting →
          </NavLink>

        </div>


      </div>

    </div>

  );
}