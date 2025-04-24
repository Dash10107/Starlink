"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Wifi, Zap, Satellite } from "lucide-react"
import * as d3 from "d3"

const speedData = [
  {
    name: "Starlink",
    speed: 150,
    latency: 20,
    color: "#3b82f6",
    icon: <Satellite className="h-6 w-6" />,
  },
  {
    name: "Fiber",
    speed: 300,
    latency: 10,
    color: "#8b5cf6",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    name: "4G/LTE",
    speed: 50,
    latency: 50,
    color: "#10b981",
    icon: <Wifi className="h-6 w-6" />,
  },
  {
    name: "Traditional Satellite",
    speed: 25,
    latency: 600,
    color: "#f97316",
    icon: <Satellite className="h-6 w-6" />,
  },
  {
    name: "DSL",
    speed: 15,
    latency: 40,
    color: "#eab308",
    icon: <Wifi className="h-6 w-6" />,
  },
]

function SpeedGauge({ data, index }: { data: (typeof speedData)[0]; index: number }) {
  const gaugeRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isInView = useInView(gaugeRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      controls.start({
        pathLength: 1,
        transition: { duration: 1.5, delay: index * 0.2, ease: "easeOut" },
      })
    }
  }, [isInView, controls, index])

  useEffect(() => {
    if (!gaugeRef.current) return

    const width = 120
    const height = 120
    const radius = Math.min(width, height) / 2

    // Clear previous SVG
    d3.select(gaugeRef.current).selectAll("*").remove()

    // Create SVG
    const svg = d3
      .select(gaugeRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Create gauge background
    const backgroundArc = d3
      .arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)

    svg
      .append("path")
      .attr("d", backgroundArc as any)
      .style("fill", "#1e293b")

    // Create gauge foreground
    const maxSpeed = 300 // Maximum speed in the dataset
    const angleScale = d3
      .scaleLinear()
      .domain([0, maxSpeed])
      .range([-Math.PI / 2, Math.PI / 2])

    const foregroundArc = d3
      .arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(-Math.PI / 2)
      .endAngle(angleScale(data.speed))

    svg
      .append("path")
      .attr("d", foregroundArc as any)
      .style("fill", data.color)
      .style("opacity", 0)
      .transition()
      .duration(1500)
      .delay(index * 200)
      .style("opacity", 1)

    // Add needle
    const needleLength = radius * 0.8
    const needleRadius = radius * 0.02

    const needle = svg.append("g").attr("transform", `rotate(${-90})`)

    needle
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", needleRadius * 2)
      .style("fill", "#e2e8f0")

    needle
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", needleLength)
      .attr("y2", 0)
      .style("stroke", "#e2e8f0")
      .style("stroke-width", needleRadius)

    // Animate needle
    needle
      .transition()
      .duration(1500)
      .delay(index * 200)
      .attr("transform", `rotate(${angleScale(data.speed) * (180 / Math.PI) - 90})`)

    // Add speed text
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", radius * 0.3)
      .attr("text-anchor", "middle")
      .style("font-size", "1.5rem")
      .style("font-weight", "bold")
      .style("fill", "#ffffff")
      .text("0")
      .transition()
      .duration(1500)
      .delay(index * 200)
      .tween("text", () => {
        const i = d3.interpolate(0, data.speed)
        return function (t) {
          d3.select(this).text(Math.round(i(t)))
        }
      })

    // Add unit text
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", radius * 0.5)
      .attr("text-anchor", "middle")
      .style("font-size", "0.75rem")
      .style("fill", "#94a3b8")
      .text("Mbps")
  }, [data, index, isInView])

  return (
    <div className="flex flex-col items-center">
      <div ref={gaugeRef} className="w-[120px] h-[120px]"></div>
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="p-1 rounded-full" style={{ backgroundColor: data.color }}>
            {data.icon}
          </div>
          <span className="font-medium">{data.name}</span>
        </div>
        <div className="text-sm text-gray-400">Latency: {data.latency} ms</div>
      </div>
    </div>
  )
}

function LatencyComparison() {
  const chartRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chartRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!chartRef.current || !isInView) return

    const width = chartRef.current.clientWidth
    const height = 300
    const margin = { top: 30, right: 30, bottom: 50, left: 60 }

    // Clear previous SVG
    d3.select(chartRef.current).selectAll("*").remove()

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Create scales
    const x = d3
      .scaleBand()
      .domain(speedData.map((d) => d.name))
      .range([0, width - margin.left - margin.right])
      .padding(0.3)

    const y = d3
      .scaleLog()
      .domain([1, 1000])
      .range([height - margin.top - margin.bottom, 0])

    // Create axes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3
      .axisLeft(y)
      .tickValues([1, 10, 100, 1000])
      .tickFormat((d) => `${d}ms`)

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .style("fill", "#94a3b8")

    svg.append("g").call(yAxis).selectAll("text").style("fill", "#94a3b8")

    // Add title
    svg
      .append("text")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "1rem")
      .style("fill", "#ffffff")
      .text("Latency Comparison (Lower is Better)")

    // Create bars
    svg
      .selectAll(".bar")
      .data(speedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name)!)
      .attr("width", x.bandwidth())
      .attr("y", height - margin.top - margin.bottom)
      .attr("height", 0)
      .attr("fill", (d) => d.color)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 200)
      .attr("y", (d) => y(d.latency))
      .attr("height", (d) => height - margin.top - margin.bottom - y(d.latency))

    // Add labels
    svg
      .selectAll(".label")
      .data(speedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.name)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.latency) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "0.75rem")
      .style("fill", "#ffffff")
      .style("opacity", 0)
      .text((d) => `${d.latency}ms`)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 200 + 500)
      .style("opacity", 1)
  }, [isInView])

  return <div ref={chartRef} className="w-full h-[300px]"></div>
}

export default function SpeedComparison() {
  return (
    <div className="grid gap-12">
      {/* Speed gauges */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-blue-900/20 p-8 rounded-xl backdrop-blur-sm border border-blue-500/20"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Zap className="h-6 w-6 text-blue-400 mr-2" />
          Download Speed Comparison
        </h3>

        <div className="flex flex-wrap justify-center gap-8">
          {speedData.map((item, index) => (
            <SpeedGauge key={index} data={item} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Latency comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-blue-900/20 p-8 rounded-xl backdrop-blur-sm border border-blue-500/20"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Zap className="h-6 w-6 text-blue-400 mr-2" />
          Latency Comparison
        </h3>

        <LatencyComparison />

        <div className="text-center text-sm text-gray-400 mt-4">
          Lower latency means faster response times for real-time applications like video calls and online gaming
        </div>
      </motion.div>
    </div>
  )
}
