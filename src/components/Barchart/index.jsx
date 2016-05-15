
import React, { Component } from 'react';
import d3 from 'd3';

const Bar = ({ x, y, width, height, name }) => (
    <rect x={x} y={y} width={width} height={height}
          style={{fill: 'steelblue'}}
          title={name} />
);

const LabeledBar = ({name, x, y, height, labelMargin, ...params}) => {
    let transform = `translate(${x}, ${y})`;

    return (
        <g transform={transform}>
            <text y={height/2+3} x={labelMargin-10}
                  textAnchor="end">{name}</text>
            <Bar x={labelMargin}
                 y="0"
                 height={height}
                 {...params} />
        </g>
    );
};

class Barchart extends Component {
    labelMargin = 200;
    xScale = d3.scaleLinear();
    yScale = d3.scaleOrdinal();

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(newProps) {
        let counts = this.counts = d3.nest()
                        .key(newProps.value)
                        .sortKeys(d3.ascending)
                        .entries(newProps.data);

        let barHeight = (newProps.height-(this.counts.length*3))/this.counts.length;

        this.xScale
            .domain([0, d3.max(counts,
                               ({key, values}) => values.length)])
            .range([0, newProps.width-this.labelMargin]);

        this.yScale
            .domain(counts.map(({key, values}) => key))
            .range(d3.range(0, barHeight*counts.length, barHeight+3));
    }

    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`;

        let barHeight = (this.props.height-(this.counts.length*3))/this.counts.length;

        return (
            <g transform={transform}>
                {this.counts.map(({ key, values }, i) => (
                    <LabeledBar x={0}
                                y={this.yScale(i)}
                                width={this.xScale(values.length)}
                                height={barHeight}
                                name={key}
                                key={`bar-${key}`}
                                labelMargin={this.labelMargin}/>
                 ))}
            </g>
        );
    }
}

export default Barchart;