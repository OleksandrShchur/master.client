import React, { useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import api from '../../services/apiService';
import { IGridItem } from '../../models/IGridItem';
import { Alert, Button, FormControl, FormControlLabel, FormLabel, LinearProgress, Radio, RadioGroup, Snackbar } from '@mui/material';
import { ISecondOrderParams } from '../../models/ISecondOrderParams';
import { Methods } from '../../models/enums/Methods';
import { MathComponent } from "mathjax-react";
import './secondOrder.css';

const columns: GridColDef[] = [
  { field: 'value', headerName: 'Точка', width: 100, valueGetter: (params: GridValueGetterParams) => 
      `${params.row.value.toFixed(4)}` },
  {
    field: 'tochne',
    headerName: 'Точне значення',
    width: 160,
    valueGetter: (params: GridValueGetterParams) => 
      `${params.row.tochne.toFixed(8)}`
  },
  {
    field: 'euler',
    headerName: 'Значення методу Ейлера',
    description: 'This column has a value getter and is not sortable.',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => 
    `${params.row.euler.toFixed(8)}`,
  },
  {
    field: 'kutta',
    headerName: 'Значення методу РК4',
    description: 'This column has a value getter and is not sortable.',
    width: 200,
    valueGetter: (params: GridValueGetterParams) => 
    `${params.row.kutta.toFixed(8)}`,
  }
];

export const SecondOrder: React.FC = () => {
    const [rows, setRows] = useState<IGridItem[]>([] as IGridItem[]);
    const [step, setStep] = useState<number | undefined>(0.001);
    const [t_0, setT_0] = useState<number>(0);
    const [t_end, setT_end] = useState<number>(2);
    const [alpha, setAlpha] = useState<number>(1);
    const [beta, setBeta] = useState<number>(-3);
    const [tau, setTau] = useState<number>(1);

    const [f_func, setF_func] = useState<string>('t-1');
    const [phi_func, setPhi_func] = useState<string>('x+4');

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
  
    const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setAlertOpen(false);
    };

    const validateForm = () => {
      return true;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const request: ISecondOrderParams = {
          t_0: t_0,
          t_end: t_end,
          alpha: alpha,
          beta: beta,
          tau: tau,
          step: step,
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
                tochne: el[1],
                euler: el[2],
                kutta: el[3]
            });
        });

        setRows(data);
      } catch (e) {
        setAlertOpen(true);
        setAlertMessage('Щось пішло не так...');
      } finally {
        setLoading(false);
      }
    };

    const calculate = async () => {
      await fetchData();
    };

    const handleSubmit = (event: any) => {
      console.log(event);
      event.preventDefault();
    }

    return (
        <>
          <Box sx={{ height: '97vh', width: '80%', overflow: 'auto' }} className='order'>
            <DataGrid
              slots={{
                loadingOverlay: LinearProgress,
              }}
              loading={loading}
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

              <form onSubmit={(event: any) => handleSubmit(event)}>
                <div className='equation'>
                  <MathComponent tex={String.raw`x'(t)=`} />
                  <input required placeholder='α' value={alpha} onChange={(e: any) => setAlpha(e.target.value)} pattern="[0-9]*" style={{ width: '36px'}} />
                  <MathComponent tex={String.raw`x(t)+`} />
                  <input required placeholder='β' value={beta} onChange={(e: any) => setBeta(e.target.value)} style={{ width: '36px'}} />
                  <MathComponent tex={String.raw`x(t-`} />
                  <input required placeholder='τ' value={tau} onChange={(e: any) => setTau(e.target.value)} style={{ width: '36px'}} />
                  <MathComponent tex={String.raw`)+`} />
                  <input placeholder='f(x)' value={f_func} onChange={(e: any) => setF_func(e.target.value)} style={{ width: '72px'}} />
                </div>
                <div className='equation'>
                <MathComponent tex={String.raw`t ∈ [`} />
                  <input required placeholder='t_0' value={t_0} onChange={(e: any) => setT_0(e.target.value)} style={{ width: '36px'}} />
                  <MathComponent tex={String.raw`;`} />
                  <input required placeholder='t' value={t_end} onChange={(e: any) => setT_end(e.target.value)} style={{ width: '36px'}} />
                  <MathComponent tex={String.raw`]`} />
                  <MathComponent tex={String.raw`,h=`} />
                  <input required placeholder='h' value={step} onChange={(e: any) => setStep(e.target.value)} style={{ width: '48px'}} />
                </div>
                <div className='equation'>
                  <MathComponent tex={String.raw`x(t)=`} />
                  <input placeholder='φ(t)' value={phi_func} onChange={(e: any) => setPhi_func(e.target.value)} style={{ width: '72px'}} />
                </div>

                <br />
                {/* <input type="submit" value="Submit" /> */}
                <Button variant="contained" onClick={() => calculate()}>Обчислити</Button>
                <br />
              </form>
            </div>
          </Box>
          <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
            <Alert onClose={handleAlertClose} severity="warning" sx={{ width: '100%' }}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </>
      );
}
