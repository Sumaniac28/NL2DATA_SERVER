interface ToolSchema {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export const MODEL_TOOLS: ToolSchema[] = [
  {
    name: 'generate_graph_data',
    description: 'Generate structured JSON data for creating charts and graphs.',
    input_schema: {
      type: 'object' as const,
      properties: {
        chartType: {
          type: 'string' as const,
          enum: ['number', 'bar', 'line', 'pie'] as const,
          description: 'The type of chart to generate'
        },
        chart: {
          type: 'object' as const,
          properties: {
            title: { type: 'string' as const },
            xAxis: { type: 'string' as const },
            yAxis: { type: 'string' as const },
            data: {
              oneOf: [
                {
                  type: 'number' as const
                },
                {
                  type: 'array' as const,
                  items: {
                    type: 'object' as const,
                    additionalProperties: true
                  }
                }
              ]
            }
          },
          required: ['title', 'xAxis', 'yAxis', 'data']
        }
      },
      required: ['chartType', 'chart']
    }
  }
];

export const CHART_TYPE_PROMPTS = {
  number: `
Analyze this time-series data and create a number visualization that:
  1. Showing count of a field
  2. Return the value as the sum of each value

  Generate the data in this structure:
  {
    "chartType": "number",
    "chart": {
      "title": "[Clear, descriptive title]",
      "data": 80
    }
}`,

  line: `
Analyze this time-series data and create a line chart visualization that:
1. Shows clear trends over time
2. Highlights key inflection points
3. Includes proper date/time formatting on the x-axis
4. Uses meaningful scale on the y-axis
5. Captures the overall pattern while preserving important details

Generate the data in this structure:
{
  "chartType": "line",
  "chart": {
    "title": "[Clear, descriptive title]",
    "xAxis": "[Time unit - e.g., Date, Month, Year]",
    "yAxis": "[Metric being measured]",
    "data": [
        {"[xAxis]": "[timestamp]", "[yAxis]": [value]},
        ...
    ]
  }
}`,

  bar: `
Analyze this categorical data and create a grouped column chart that:
1. Shows vertical comparisons between categories
2. Displays clear value relationships
3. Uses logical grouping
4. Maintains clear spacing
5. Emphasizes key differences

Generate the data in this structure:
{
    "chartType": "bar",
    "chart": {
      "title": "[Clear, descriptive title]",
      "xAxis": "[Category name]",
      "yAxis": "[Metric being compared]",
      "data": [
          {"[xAxis]": "[category]", "[yAxis]": [value]},
          ...
      ]
    }
}`,

  pie: `
Analyze this distribution data and create a pie chart that:
1. Shows clear segment proportions
2. Uses logical grouping of smaller segments
3. Highlights significant segments
4. Maintains readable labels
5. Represents the total distribution effectively

Generate the data in this structure:
{
    "chartType": "pie",
    "chart": {
      "title": "[Clear, descriptive title]",
      "xAxis": "segment",
      "yAxis": "value",
      "data": [
        {"segment": "[category name]", "value": [numeric value], color: '#fff4345'},
        ...
      ]
    }
}`
};

export const SYSTEM_PROMPT = `You are a data visualization expert. Your role is to analyze data and create clear, meaningful visualizations using generate_graph_data tool:

Here are the chart types available and their idea use cases:

1. NUMBER ("number")
   - Data showing count of a field

2. LINE CHARTS ("line")
   - Time series data showing trends
   - Financial metrics over time
   - Market performance tracking

3. BAR CHARTS ("bar")
   - Single metric comparisons
   - Period-over-period analysis
   - Category performance

4. PIE CHARTS ("pie")
   - Distribution analysis
   - Market share breakdown
   - Portfolio allocation

When generating visualizations:
1. Structure data correctly based on the chart type
2. Use descriptive titles and clear descriptions
3. Include trend information when relevant (percentage and direction)
4. Use proper data keys that reflect actual metrics

Data Structure Examples:

For Time-Series (line/bar):
{
  chart: {
    title: "Top 10 most followed teams",
    xAxis: "Name",
    yAxis: "Age",
    data: [
      {[xAxis]: "Arsenal F.C.", [yAxis]: 88},
      {[xAxis]: "Chelsea", [yAxis]: 80},
    ],
  }
}

For Distributions (pie):
{
  chart: {
    title: "Portfolio Allocation",
    xAxis: "segment",
    yAxis: "value",
    data: [
      { segment: "Equities", value: 5500000, color: '#fg735d' },
      { segment: "Bonds", value: 3200000, color: '#4aa1f3' }
    ],
  }
}

Always:
- Generate real, contextually appropriate data
- Use proper formatting
- Include relevant trends and insights
- Structure data exactly as needed for the chosen chart type
- Use the specified visualization for the data

Never:
- Use placeholder or static data
- Announce the tool usage
- Include technical implementation details in responses
- NEVER SAY you are using the generate_graph_data tool, just execute it when needed.

Focus on clear insights and let the visualization enhance understanding.

`;

export const sqlPromptMessage = (schema: string, userPrompt: string): string => {
  const content = `You are a SQL expert. Based on this database schema:

${schema}

Generate a SQL query to answer this question: "${userPrompt}"

Requirements:
1. For SELECT, use * instead of column name in the SQL statement
2. Return ONLY the SQL query, nothing else
3. Ensure it's a valid PostgreSQL query
4. Use appropriate JOINS when needed
5. Include proper WHERE clauses for filtering
6. Add ORDER BY clauses when relevant
7. Use appropriate aggregations (COUNT, SUM, AVG, etc.)
8. Include LIMIT clause if result set could be large`;
  return content;
};

export const generateChartPrompt = (
  userPrompt: string,
  chartType: string,
  chartPrompt: string,
  data: string
): string => {
  const message = `
Chart Type Required: ${chartType} chart

User Request:
${userPrompt}

Visualization Requirements:
${chartPrompt}

Data to visualize:
${data}

Important: This data MUST be visualized as a ${chartType} chart.`;
  return message;
};

export const sqlGeneratorPrompt = (schema: string, prompt: string): string => {
  const message = `You are a SQL expert. Based on this database schema:

${schema}

Generate a SQL query to answer this question: "${prompt}"

Requirements:
1. Return ONLY the SQL query, nothing else
2. Ensure it's a valid PostgreSQL query
3. Use appropriate JOINS when needed
4. Include proper WHERE clauses for filtering
5. Add ORDER BY clauses when relevant
6. Use appropriate aggregations (COUNT, SUM, AVG, etc.)
7. Include LIMIT clause if result set could be large
8. Return the appropriate field names in the data.
9. If the prompt has a text that is contained the in table column, the column should be part of the response.
`;
  return message;
};
// interface ToolSchema {
//   name: string;
//   description: string;
//   input_schema: {
//     type: 'object';
//     properties: Record<string, unknown>;
//     required: string[];
//   };
// }

// export const MODEL_TOOLS: ToolSchema[] = [
//   {
//     name: 'generate_graph_data',
//     description: 'Generate structured JSON data for creating charts and graphs.',
//     input_schema: {
//       type: 'object' as const,
//       properties: {
//         chartType: {
//           type: 'string' as const,
//           enum: [
//             'number',
//             'bar',
//             'line',
//             'pie',
//             'doughnut',
//             'radar',
//             'bubble',
//             'scatter',
//             'polarArea',
//             'area'
//           ] as const,
//           description: 'The type of chart to generate'
//         },
//         chart: {
//           type: 'object' as const,
//           properties: {
//             title: { type: 'string' as const },
//             xAxis: { type: 'string' as const },
//             yAxis: { type: 'string' as const },
//             data: {
//               oneOf: [
//                 { type: 'number' as const },
//                 {
//                   type: 'array' as const,
//                   items: {
//                     type: 'object' as const,
//                     additionalProperties: true
//                   }
//                 }
//               ]
//             }
//           },
//           required: ['title', 'xAxis', 'yAxis', 'data']
//         }
//       },
//       required: ['chartType', 'chart']
//     }
//   }
// ];

// export const CHART_TYPE_PROMPTS = {
//   number: `
// Analyze this time-series data and create a number visualization that:
// 1. Shows count of a field
// 2. Returns the value as the sum of all values

// Generate the data in this structure:
// {
//   "chartType": "number",
//   "chart": {
//     "title": "[Clear, descriptive title]",
//     "data": 80
//   }
// }`,

//   line: `
// Analyze this time-series data and create a line chart visualization that:
// 1. Shows clear trends over time
// 2. Highlights key inflection points
// 3. Uses proper date/time formatting on the x-axis
// 4. Includes meaningful y-axis values

// Generate the data in this structure:
// {
//   "chartType": "line",
//   "chart": {
//     "title": "[Descriptive title]",
//     "xAxis": "[Time unit]",
//     "yAxis": "[Metric]",
//     "data": [
//       {"[xAxis]": "[timestamp]", "[yAxis]": [value]},
//       ...
//     ]
//   }
// }`,

//   area: `
// Analyze this cumulative time-series data and create an area chart that:
// 1. Shows growth or accumulation over time
// 2. Includes proper date formatting on x-axis
// 3. Uses filled area below the curve

// Generate the data in this structure:
// {
//   "chartType": "area",
//   "chart": {
//     "title": "[Descriptive title]",
//     "xAxis": "[Time unit]",
//     "yAxis": "[Cumulative metric]",
//     "data": [
//       {"[xAxis]": "[timestamp]", "[yAxis]": [value]},
//       ...
//     ]
//   }
// }`,

//   bar: `
// Analyze this categorical data and create a bar chart that:
// 1. Shows comparisons across categories
// 2. Uses clear labels
// 3. Emphasizes significant differences

// Generate the data in this structure:
// {
//   "chartType": "bar",
//   "chart": {
//     "title": "[Descriptive title]",
//     "xAxis": "[Category name]",
//     "yAxis": "[Metric]",
//     "data": [
//       {"[xAxis]": "[category]", "[yAxis]": [value]},
//       ...
//     ]
//   }
// }`,

//   pie: `
// Analyze this data and create a pie chart that:
// 1. Shows percentage contribution of parts to whole
// 2. Highlights major segments

// Generate the data in this structure:
// {
//   "chartType": "pie",
//   "chart": {
//     "title": "[Title]",
//     "xAxis": "segment",
//     "yAxis": "value",
//     "data": [
//       {"segment": "[name]", "value": [value], "color": "#colorCode"},
//       ...
//     ]
//   }
// }`,

//   doughnut: `
// Analyze the data and create a doughnut chart:
// 1. Displays part-to-whole relationships
// 2. Adds central space for readability

// Structure:
// {
//   "chartType": "doughnut",
//   "chart": {
//     "title": "[Title]",
//     "xAxis": "segment",
//     "yAxis": "value",
//     "data": [
//       {"segment": "[name]", "value": [value], "color": "#colorCode"},
//       ...
//     ]
//   }
// }`,

//   radar: `
// Create a radar chart to compare multiple variables across different categories:
// 1. Shows relative performance or characteristics

// Structure:
// {
//   "chartType": "radar",
//   "chart": {
//     "title": "[Title]",
//     "xAxis": "dimension",
//     "yAxis": "score",
//     "data": [
//       {"dimension": "Attribute A", "score": 70},
//       ...
//     ]
//   }
// }`,

//   bubble: `
// Create a bubble chart where each point has x, y, and size:
// 1. X and Y for positioning
// 2. Size represents magnitude

// Structure:
// {
//   "chartType": "bubble",
//   "chart": {
//     "title": "[Title]",
//     "xAxis": "X Metric",
//     "yAxis": "Y Metric",
//     "data": [
//       {"x": 10, "y": 20, "r": 15},
//       ...
//     ]
//   }
// }`,

//   scatter: `
// Generate a scatter plot for arbitrary two-dimensional data:
// 1. Shows correlation between two metrics

// Structure:
// {
//   "chartType": "scatter",
//   "chart": {
//     "title": "[Title]",
//     "xAxis": "X Metric",
//     "yAxis": "Y Metric",
//     "data": [
//       {"x": 4.2, "y": 9.1},
//       ...
//     ]
//   }
// }`,

//   polarArea: `
// Create a polar area chart to show proportion by radius:
// 1. Segments differ in angle and radius

// Structure:
// {
//   "chartType": "polarArea",
//   "chart": {
//     "title": "[Title]",
//     "xAxis": "category",
//     "yAxis": "value",
//     "data": [
//       {"category": "A", "value": 22},
//       ...
//     ]
//   }
// }`
// };

// export const SYSTEM_PROMPT = `You are a data visualization expert. Your role is to analyze data and create clear, meaningful visualizations using generate_graph_data tool.

// Supported chart types:

// 1. NUMBER ("number") - For summarizing a single value
// 2. LINE ("line") - Time series, financial trends
// 3. AREA ("area") - Accumulated time series data
// 4. BAR ("bar") - Category comparison
// 5. PIE ("pie") - Percentage breakdown
// 6. DOUGHNUT ("doughnut") - Same as pie but with a central gap
// 7. RADAR ("radar") - Multi-variable comparison
// 8. BUBBLE ("bubble") - X/Y plots with size
// 9. SCATTER ("scatter") - X/Y plots for correlation
// 10. POLAR AREA ("polarArea") - Radial category distribution

// When generating visualizations:
// - Structure data correctly
// - Use descriptive titles
// - Reflect real trends
// - Avoid dummy/placeholder data
// - Never mention the generate_graph_data tool

// Example data:
// {
//   chartType: "bar",
//   chart: {
//     title: "Revenue by Department",
//     xAxis: "Department",
//     yAxis: "Revenue",
//     data: [
//       { Department: "Sales", Revenue: 120000 },
//       ...
//     ]
//   }
// }`;

// export const sqlPromptMessage = (schema: string, userPrompt: string): string => {
//   return `
// You are a SQL expert. Based on this database schema:

// ${schema}

// Generate a SQL query to answer this question: "${userPrompt}"

// Requirements:
// 1. Use * in SELECT
// 2. Only return the query
// 3. Use valid PostgreSQL
// 4. Apply joins, filters, ordering
// 5. Use aggregations when needed
// 6. Add LIMIT when result set is large
// `;
// };

// export const generateChartPrompt = (
//   userPrompt: string,
//   chartType: string,
//   chartPrompt: string,
//   data: string
// ): string => {
//   return `
// Chart Type Required: ${chartType} chart

// User Request:
// ${userPrompt}

// Visualization Requirements:
// ${chartPrompt}

// Data to visualize:
// ${data}

// Important: This data MUST be visualized as a ${chartType} chart.
// `;
// };

// export const sqlGeneratorPrompt = (schema: string, prompt: string): string => {
//   return `
// You are a SQL expert. Based on this database schema:

// ${schema}

// Generate a SQL query to answer this question: "${prompt}"

// Requirements:
// 1. Only return the query
// 2. Use valid PostgreSQL
// 3. Include joins, filters, ordering, aggregation
// 4. Use LIMIT if applicable
// 5. Return relevant field names
// 6. Include matching columns if referenced by prompt
// `;
// };
