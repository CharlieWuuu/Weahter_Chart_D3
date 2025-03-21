import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface ClimateMonth {
    month: string;
    maxTemp: string;
    minTemp: string;
}

interface Props {
    data: ClimateMonth[];
}

export default function TemperatureChart({ data }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data.length || !svgRef.current) return;

        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 60, left: 40 };

        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height).style('background-color', 'gray').style('border-radius', '8px');

        svg.selectAll('*').remove();

        const x = d3
            .scaleBand<string>()
            .domain(data.map((d) => d.month))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        let scaleMinTemp = d3.min(data, (d) => +d.minTemp)! < 0 ? d3.min(data, (d) => +d.minTemp)! : 0;
        let scaleMaxTemp = d3.max(data, (d) => +d.maxTemp)!;

        const y = d3
            .scaleLinear()
            .domain([scaleMinTemp, scaleMaxTemp])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0));

        xAxis.selectAll('text').attr('fill', '#fff').attr('font-size', '10px').attr('dy', '0.8em').style('text-anchor', 'end');

        xAxis.select('.domain').attr('stroke', '#fff');

        // Y axis: labels + tick lines, no axis path
        const yAxis = svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y).tickSizeOuter(0));

        yAxis.select('.domain').remove();
        yAxis.selectAll('text').attr('fill', '#fff').attr('font-size', '10px');
        yAxis.selectAll('.tick line').attr('stroke', '#fff');

        // Bars: from minTemp up to maxTemp
        svg.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', (d) => x(d.month)!)
            .attr('width', x.bandwidth())
            // 初始狀態：從 y=0、高度=0 開始
            .attr('y', y(0))
            .attr('height', 0)
            .attr('fill', '#fff')
            .transition() // ← 加這裡
            .duration(1000) // 動畫持續 1 秒
            .ease(d3.easeCubicOut) // 慢進快出
            .attr('y', (d) => y(+d.maxTemp))
            .attr('height', (d) => y(+d.minTemp) - y(+d.maxTemp));
    }, [data]);

    return <svg ref={svgRef} />;
}
