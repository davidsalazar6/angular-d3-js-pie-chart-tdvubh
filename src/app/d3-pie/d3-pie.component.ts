import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { D3Service } from '../d3.service';

@Component({
  selector: 'app-d3-pie',
  templateUrl: './d3-pie.component.html',
  styleUrls: ['./d3-pie.component.css'],
})
export class D3PieComponent implements AfterViewInit {
  @Input('pieData') private pieData: SimpleDataModel[] = [];
  @ViewChild('pie') svgElement: ElementRef;
  @ViewChild('legend') legendElement: ElementRef;

  private svg;
  private margin = 50;
  private width = 900;
  private height = 899;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colorMapping = {};
  private textColor: string = '#ffffff';
  private colors;
  private tooltip;
  // Variables for pagination
  private currentPage = 0;
  private itemsPerPage = 10;
  private totalPages = Math.ceil(this.pieData.length / this.itemsPerPage);
  constructor(private d3: D3Service) {}

  ngAfterViewInit() {
    this.initSvg();
    this.initTooltip();
    this.initColors();
    this.listenForPageNavigation();
    this.drawChart();
    this.updatePage();
  }
  private initSvg() {
    this.svg = this.createSvg();
  }
  private initTooltip() {
    this.tooltip = this.d3.d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('color', '#fff')
      .style('padding', '8px')
      .style('background-color', 'black')
      .style('color', 'white')
      .style('font-family', 'Arial, sans-serif')
      .style('font-size', '12px')
      .style('min-width', '200px');
  }
  private initColors() {
    this.createColors();
  }
  private listenForPageNavigation() {
    fromEvent(document, 'click')
      .pipe(
        map((event: any) => event.target.id),
        tap((id) => this.updatePageIfValid(id))
      )
      .subscribe(() => {
        this.updatePage();
      });
  }
  private updatePageIfValid(id: string) {
    if (id === 'prevPage' && this.currentPage > 0) {
      this.currentPage--;
    } else if (id === 'nextPage' && this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }
  private drawChart(): void {
    const pie = this.d3.d3.pie<any>().value((d: any) => Number(d.value));
    const data_ready = pie(this.pieData);

    this.drawSlices(data_ready, this.getArcDefinitionForPie());
    this.addLabels(this.getArcDefinitionForPie(), data_ready);
    // Uncomment if you want to draw donut chart
    // this.drawSlices(data_ready, this.getArcDefinitionForDonut());
    // this.addLabels(this.getArcDefinitionForDonut(), data_ready)
  }
  private updatePage(): void {
    this.totalPages = Math.ceil(this.pieData.length / this.itemsPerPage);
    const legendDiv = this.d3.d3.select(this.legendElement.nativeElement);

    // Clear the old legend
    legendDiv.selectAll('.legend').remove();

    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    // Sort the pieData array in descending order by value
    this.pieData.sort((a, b) => b.value - a.value);
    const pageData = this.pieData.slice(start, end);
    this.appendLegend(legendDiv, pageData);
    // update the page count display
    this.updatePageCount();
  }
  private updatePageCount() {
    const totalPages = Math.ceil(this.pieData.length / this.itemsPerPage);
    this.d3.d3
      .select('#pageCount')
      .text(`${this.currentPage + 1}/${totalPages}`);
  }

  private createSvg(): any {
    return this.d3.d3
      .select(this.svgElement.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    const colorScaleGreen = this.d3.d3.scaleSequential(
      this.d3.d3.interpolateViridis
    );
    this.pieData.forEach((d, i) => {
      const adjustedIndex = 0.2 + (i / this.pieData.length) * 0.8;
      this.colorMapping[d.name] = colorScaleGreen(adjustedIndex);
    });
    this.colors = (i) => this.colorMapping[this.pieData[i].name];
  }

  private drawSlices(data_ready, arc) {
    const totalValue = this.pieData.reduce((total, d) => total + d.value, 0);
    this.svg
      .selectAll('pieces')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => (d.data.color ? d.data.color : this.colors(i)))
      .attr('stroke', '#FFFFFF')
      .style('stroke-width', '1px')
      .on('mouseover', (event, d) => {
        const percentage = ((d.data.value / totalValue) * 100).toFixed(2);
        this.tooltip
          .style('visibility', 'visible')
          .html(
            `Name: ${d.data.name} <br/> Value: ${d.data.value} <br/> Percentage: ${percentage}%`
          );
      })
      .on('mousemove', (event, d) => {
        this.tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', (event, d) => {
        this.tooltip.style('visibility', 'hidden');
      });
  }

  private getArcDefinitionForPie() {
    return this.d3.d3.arc().innerRadius(0).outerRadius(this.radius);
  }

  private getArcDefinitionForDonut() {
    return this.d3.d3
      .arc()
      .innerRadius(this.radius * 0.6)
      .outerRadius(this.radius);
  }

  private addLabels(arc, data_ready) {
    const total = this.pieData.reduce((acc, d) => acc + d.value, 0);
    const threshold = 0.05; // slices representing less than 5% of the total

    this.svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      // For slices above threshold, place labels inside
      .filter((d) => (d.endAngle - d.startAngle) / (2 * Math.PI) > threshold)
      .text((d) => ((d.data.value / total) * 100).toFixed(2) + '%')
      .attr('transform', (d) => 'translate(' + arc.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 20)
      .style('font-family', 'Arial, sans-serif')
      .style('fill', this.textColor);
  }

  private appendLegend(legendDiv, data) {
    const legendItems = legendDiv.select('#legend-items');
    // create one line in the legend for each data element
    const legend = legendItems
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
      // Use the color mapping created for the pie chart
      .style('background-color', (d) => this.colorMapping[d.name]);

    legend.append('span').text((d) => d.name + ' - ' + d.value);
  }
}

export interface SimpleDataModel {
  name: string;
  value: number;
}

export const colors = [
  '#e6194b',
];
