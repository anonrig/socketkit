import SidebarLayout from "layouts/sidebar.js";
import Sidebar from "components/sidebar-reports.js";
import { fetcher } from "helpers/fetcher.js";

import { ResponsiveBar } from "@nivo/bar";

import useSWR from "swr";

export async function getServerSideProps(ctx) {
  const { cookie, referer } = ctx.req?.headers ?? {};
  const initialData = await fetcher(`reports/trials`, {
    headers: { cookie, referer },
  });
  return {
    props: { initialData },
  };
}

export default function Reports({ initialData }) {
  const { data } = useSWR("reports/trials", fetcher, { initialData });
  return (
    <SidebarLayout leading={<Sidebar />}>
      <div className="flex flex-1 justify-between mb-5 items-center">
        <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-2xl">
          Reports
        </h3>
      </div>

      <div className="h-96 w-full">
        <ResponsiveBar
          data={data.rows}
          keys={["secondary"]}
          indexBy="primary"
          margin={{ top: 0, right: 0, bottom: 50, left: 0 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </SidebarLayout>
  );
}
