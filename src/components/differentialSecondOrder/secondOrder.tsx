import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import api from '../../services/apiService';
import { IGridItem } from '../../models/IGridItem';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { ISecondOrderParams } from '../../models/ISecondOrderParams';
import { Methods } from '../../models/enums/Methods';

const columns: GridColDef[] = [
    { field: 'value', headerName: 'Точка', width: 120, valueGetter: (params: GridValueGetterParams) => 
        `${params.row.value.toFixed(6)}` },
    {
      field: 'x',
      headerName: 'Значення X',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => 
        `${params.row.x.toFixed(8)}`
    },
    {
      field: 'y',
      headerName: 'Значення Y',
      description: 'This column has a value getter and is not sortable.',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => 
      `${params.row.y.toFixed(8)}`,
    },
  ];

export const SecondOrder: React.FC = () => {
    const [rows, setRows] = useState<IGridItem[]>([] as IGridItem[]);
    const [h, setH] = useState<number>(0);
    const [t_0, setT_0] = useState<number>(0);
    const [t_end, setT_end] = useState<number>(0);
    const [y_0, setY_0] = useState<number>(0);
    const [y_1, setY_1] = useState<number>(0);

    const [method, setMethod] = useState<Methods>(Methods.euler);

    const fetchData = async () => {
      const request: ISecondOrderParams = {
        h: h,
        t_0: t_0,
        t_end: t_end,
        y_0: y_0,
        y_1: y_1,
        method: method
      };

      const response = await api.post('second-order/euler', request);

      let data: IGridItem[] = [];
      let i = 1;
      console.log(response);
      response.data.forEach((el: any) => {
          data.push({
              id: i++,
              value: el[0],
              x: el[1],
              y: el[2]
          });
      });

      setRows(data);
    };

    const calculate = async () => {
      await fetchData();
    };

    return (
        <Box sx={{ height: '100vh', width: '60%', overflow: 'auto' }} className='order'>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 50, 100]}
            disableRowSelectionOnClick
          />
          <div className='vertical left-spacing' style={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '50px'
            }}>
              <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Метод розв'язування</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                value={method}
                onChange={(e: any) => setMethod(e.target.value)}
              >
                <FormControlLabel value={Methods.euler} control={<Radio />} label="Метод Ейлера" />
                <FormControlLabel value={Methods.runge} control={<Radio />} label="Метод Рунге-Кутти" />
              </RadioGroup>
            </FormControl>
            <TextField id="standard-basic" label="y0" variant="standard"  value={y_0} onChange={(e: any) => setY_0(e.target.value)} />
            <TextField id="standard-basic" label="y1" variant="standard"  value={y_1} onChange={(e: any) => setY_1(e.target.value)} />
            <TextField id="standard-basic" label="Крок: h" variant="standard"  value={h} onChange={(e: any) => setH(e.target.value)} />
            <TextField id="standard-basic" label="Початок відрізку: t_0" variant="standard" value={t_0} onChange={(e: any) => setT_0(e.target.value)} />
            <TextField id="standard-basic" label="Кінець відрізку: t_end" variant="standard" value={t_end} onChange={(e: any) => setT_end(e.target.value)} />
            <br />
            <Button variant="contained" onClick={() => calculate()}>Обчислити</Button>
            <br />
            <span>
              Формула
            </span>
            <span>
              d^2*y / dt^2 = -2 * dy / dt - 3 * y
            </span>
          </div>
        </Box>
      );
}
