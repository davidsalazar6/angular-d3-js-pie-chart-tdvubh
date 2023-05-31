import { Component, Input, OnInit } from '@angular/core';
import { D3Service } from '../d3.service';

@Component({
  selector: 'app-d3-pie',
  templateUrl: './d3-pie.component.html',
  styleUrls: ['./d3-pie.component.css'],
})
export class D3PieComponent implements OnInit {
  @Input('pieData') private pieData: SimpleDataModel[] = [];
  @Input('textColor') private textColor: string = '#ffffff';
  @Input('isPercentage') private isPercentage: boolean = false;
  @Input('enablePolylines') private enablePolylines: boolean = false;

  public chartId;
  private svg;
  private margin = 25;
  private width = 750;
  private height = 450;

  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;

  private colors;
  constructor(private d3: D3Service) {
    this.chartId = this.d3.generateId(5);
  }

  ngOnInit() {
    this.createSvg();
    this.createColors();
    this.drawChart();
    this.drawLegend();
  }

  private createSvg(): void {
    this.svg = this.d3.d3
      .select('figure#pie')
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      // .attr('width', this.width)
      //.attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }
  private colorMapping = {};
  private createColors(data = this.pieData): void {
    this.colors = this.d3.d3
      .scaleOrdinal()
      .domain(data.map((d) => d.value.toString()))
      .range(colors);

    // Store color mapping
    data.forEach((d, i) => {
      this.colorMapping[d.name] = this.colors(i);
    });
  }

  private drawChart(data = this.pieData): void {
    const pie = this.d3.d3.pie<any>().value((d: any) => Number(d.value));
    const data_ready = pie(data);
    let totalValue = data.reduce((total, d) => total + d.value, 0);
    // draw slices
    this.svg
      .selectAll('pieces')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', this.d3.d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d, i) => (d.data.color ? d.data.color : this.colors(i)))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px')
      .on('mouseover', function (event, d) {
        Tooltip.style('opacity', 1)
          .html(
            d.data.name +
              ' - ' +
              d.data.value +
              ' (' +
              ((d.data.value / totalValue) * 100).toFixed(2) +
              '%)'
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mousemove', function (event, d) {
        Tooltip.style('left', event.pageX + 10 + 'px').style(
          'top',
          event.pageY - 10 + 'px'
        );
      })
      .on('mouseout', function (d) {
        Tooltip.style('opacity', 0);
      });

    // Now add the annotation. Use the centroid method to get the best coordinates
    const labelLocation = this.d3.d3
      .arc()
      .innerRadius(50)
      .outerRadius(this.radius);
    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text(
        (d) =>
          `${(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100).toFixed(2)}%`
      )
      .attr('transform', (d) => 'translate(' + labelLocation.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 15)
      .attr('fill', this.textColor);
    // Create a tooltip
    const Tooltip = this.d3.d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'black')
      .style('color', 'white')
      .style('padding', '5px');
  }
  private drawLegend(data = this.pieData): void {
    const container = this.d3.d3.select('#legend');
    const legendDiv = this.d3.d3.select('#legend');
    let totalValue = data.reduce((total, d) => total + d.value, 0);

    // create one line in the legend for each data element
    const legend = legendDiv
      .selectAll('.legend')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'legend');

    legend
      .append('div')
      .style('width', '20px')
      .style('height', '20px')
      .style('display', 'inline-block')
      .style('margin-right', '5px')
      .style('background-color', (d) => this.colorMapping[d.name]);

    legend
      .append('span')
      .text(
        (d) => d.name + ' - ' + ((d.value / totalValue) * 100).toFixed(2) + '%'
      );
  }
}

export interface SimpleDataModel {
  name: string;
  value: number;
  // color?: string;
}
export const colors = [
  '#0000FF',
  '#0010FF',
  '#0020FF',
  '#0030FF',
  '#0040FF',
  '#0050FF',
  '#0060FF',
  '#0070FF',
  '#0080FF',
  '#0090FF',
  '#00A0FF',
  '#00B0FF',
  '#00C0FF',
  '#00D0FF',
  '#00E0FF',
  '#1F7FFF',
  '#3F5FFF',
  '#5F3FFF',
  '#7F1FFF',
  '#9F00FF',
];
