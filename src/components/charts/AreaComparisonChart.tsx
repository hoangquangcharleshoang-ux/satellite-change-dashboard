import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AnalysisSummary } from '../../types/analysis'

interface AreaComparisonChartProps {
  summary: AnalysisSummary
}

const areaColors = {
  loss: '#dc3c3c',
  gain: '#2878d0',
  urban: '#e89b0e',
}

function formatArea(value: number) {
  return `${value.toFixed(3)} km\u00B2`
}

export function AreaComparisonChart({ summary }: AreaComparisonChartProps) {
  const data = [
    {
      name: 'Vegetation loss',
      areaKm2: summary.stats.vegetationLossKm2,
      color: areaColors.loss,
    },
    {
      name: 'Vegetation gain',
      areaKm2: summary.stats.vegetationGainKm2,
      color: areaColors.gain,
    },
    {
      name: 'Urban expansion candidate',
      areaKm2: summary.combinedChange.areaKm2,
      color: areaColors.urban,
    },
  ]

  return (
    <article className="panel chart-panel">
      <header className="panel__header">
        <div>
          <h2>Detected Change Area</h2>
          <p>Area comparison in km{'\u00B2'}</p>
        </div>
      </header>
      <div
        className="area-chart"
        aria-label="Area comparison chart for detected change categories"
        role="img"
      >
        <ResponsiveContainer
          height="100%"
          initialDimension={{ height: 250, width: 1000 }}
          minWidth={0}
          width="100%"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ bottom: 8, left: 8, right: 56, top: 8 }}
          >
            <CartesianGrid horizontal={false} stroke="#e8eeeb" />
            <XAxis
              axisLine={false}
              domain={[0, 'dataMax']}
              tick={{ fill: '#8a9990', fontSize: 11 }}
              tickLine={false}
              type="number"
              unit={` km\u00B2`}
            />
            <YAxis
              axisLine={false}
              dataKey="name"
              tick={{ fill: '#5e7068', fontSize: 11 }}
              tickLine={false}
              type="category"
              width={168}
            />
            <Tooltip
              cursor={{ fill: '#eaf0ec' }}
              formatter={(value) => [formatArea(Number(value)), 'Area']}
            />
            <Bar dataKey="areaKm2" maxBarSize={30} radius={[0, 5, 5, 0]}>
              {data.map((item) => (
                <Cell fill={item.color} key={item.name} />
              ))}
              <LabelList
                dataKey="areaKm2"
                fill="#2d3d33"
                fontSize={11}
                formatter={(value: unknown) => Number(value).toFixed(3)}
                position="right"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-panel__caveat">
        The urban expansion value is a candidate area, not confirmed land-use
        change.
      </p>
    </article>
  )
}
