import React, { useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import api from '../../services/apiService';
import { IGridItem } from '../../models/IGridItem';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { ISecondOrderParams } from '../../models/ISecondOrderParams';
import { Methods } from '../../models/enums/Methods';
import { MathComponent } from "mathjax-react";
import './secondOrder.css';

const columns: GridColDef[] = [
    { field: 'value', headerName: 'Точка', width: 100, valueGetter: (params: GridValueGetterParams) => 
        `${params.row.value.toFixed(4)}` },
    {
      field: 'x',
      headerName: 'Точне значення',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => 
        `${params.row.x.toFixed(8)}`
    },
    {
      field: 'y',
      headerName: 'Наближене значення',
      description: 'This column has a value getter and is not sortable.',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => 
      `${params.row.y.toFixed(8)}`,
    },
  ];

export const SecondOrder: React.FC = () => {
    const [rows, setRows] = useState<IGridItem[]>([] as IGridItem[]);
    const [step, setStep] = useState<number | undefined>();
    const [t_0, setT_0] = useState<number>();
    const [t_end, setT_end] = useState<number>();
    const [alpha, setAlpha] = useState<number>();
    const [beta, setBeta] = useState<number>();
    const [tau, setTau] = useState<number>();

    const [f_func, setF_func] = useState<string>('');
    const [phi_func, setPhi_func] = useState<string>('');

    const [method, setMethod] = useState<Methods>(Methods.euler);

    const fetchData = async () => {
      const request: ISecondOrderParams = {
        t_0: t_0,
        t_end: t_end,
        alpha: alpha,
        beta: beta,
        tau: tau,
        step: step,
        method: method,
        f_func: f_func,
        phi_func: phi_func
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
              paddingLeft: '50px',
              width: '60vh'
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

            <div>
              <div className='equation'>
                <MathComponent tex={String.raw`x'(t)=`} />
                <input required placeholder='α' onChange={(e: any) => setAlpha(e.target.value)} style={{ width: '36px'}} />
                <MathComponent tex={String.raw`x(t)+`} />
                <input required placeholder='β' onChange={(e: any) => setBeta(e.target.value)} style={{ width: '36px'}} />
                <MathComponent tex={String.raw`x(t-`} />
                <input required placeholder='τ' onChange={(e: any) => setTau(e.target.value)} style={{ width: '36px'}} />
                <MathComponent tex={String.raw`)+`} />
                <input placeholder='f(x)' onChange={(e: any) => setF_func(e.target.value)} style={{ width: '72px'}} />
              </div>
              <div className='equation'>
              <MathComponent tex={String.raw`t ∈ [`} />
                <input required placeholder='t_0' value={t_0} onChange={(e: any) => setT_0(e.target.value)} style={{ width: '36px'}} />
                <MathComponent tex={String.raw`;`} />
                <input required placeholder='t' value={t_end} onChange={(e: any) => setT_end(e.target.value)} style={{ width: '36px'}} />
                <MathComponent tex={String.raw`]`} />
                <MathComponent tex={String.raw`,h=`} />
                <input required placeholder='h' value={step} onChange={(e: any) => setStep(e.target.value)} style={{ width: '42px'}} />
              </div>
              <div className='equation'>
                <MathComponent tex={String.raw`x(t)=`} />
                <input placeholder='φ(t)' onChange={(e: any) => setPhi_func(e.target.value)} style={{ width: '72px'}} />
              </div>
            </div>

            <br />
              <Button variant="contained" onClick={() => calculate()}>Обчислити</Button>
            <br />
          </div>
        </Box>
      );
}
