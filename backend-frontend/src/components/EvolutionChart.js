import React from "react";
import PropTypes from 'prop-types';
import { Chart } from "react-google-charts";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function EvolutionChart({ data, options, evolutionCategory, eventCallback = () => ({}) }) {
  if (data.length === 0) {
    return ('Loading...')
  } else if (data.length === 1) {
    return (
      <Box sx={{
        p: 20,
        border: '2px dashed #008080'
      }}>
        <Typography variant="h5" component="h1" align="center">
          No data!
        </Typography>
      </Box>
    )
  }

  const chartEvents = [
    {
      eventName: "select",
      callback({ chartWrapper }) {
        const selection = chartWrapper.getChart().getSelection();
        if (selection.length > 0) eventCallback(selection[0], evolutionCategory);
      }
    }
  ];
  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
      chartEvents={chartEvents}
    />
  );
}

EvolutionChart.propTypes = {
  data: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  evolutionCategory: PropTypes.object.isRequired,
  eventCallback: PropTypes.func.isRequired,
};