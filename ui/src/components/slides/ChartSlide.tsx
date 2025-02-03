import React, { useState, useEffect } from 'react';
import Slide from './Slide';
import { ChartSlideConfig } from '../../types/slides';
import Chart from '../charts/Chart';
import LoadingIndicator from '../charts/LoadingIndicator';
import ErrorDisplay from '../charts/ErrorDisplay';
import { loadChartData } from '../../utils/chart';
import { Box, Typography } from '@mui/material';

interface ChartSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slideConfig: ChartSlideConfig;
}

const ChartSlide: React.FC<ChartSlideProps> = ({ slideConfig, ...slideProps }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const chartData = await loadChartData(slideConfig.content.url, slideConfig.content.asOfDate);
        setData(chartData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slideConfig.content.url, slideConfig.content.asOfDate]);

  console.log(slideConfig);

  return (
    <Slide
      {...slideProps}
      text=""  // Empty string since we're not using text in chart slides
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: '10%'  // Add margin to move everything down
        }}
      >
        {slideConfig.content.caption && (
          <Typography 
            variant="h4" 
            align="center"
            sx={{ 
              mb: 3,
              color: 'white',
              fontWeight: 500
            }}
          >
            {slideConfig.content.caption}
          </Typography>
        )}
        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <ErrorDisplay message={error} />
        ) : data ? (
          <Chart 
            data={data} 
            goal={slideConfig.content.goal}
            rounding={slideConfig.content.rounding}
            units={slideConfig.content.units}
            asOfDate={slideConfig.content.asOfDate}
          />
        ) : null}
      </Box>
    </Slide>
  );
};

export default ChartSlide;
