import React, { useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import api from '../../services/apiService';
import { IGridItem } from '../../models/IGridItem';
import { Alert, FormControlLabel, LinearProgress, Radio, Snackbar, RadioGroup, FormControl, Select, MenuItem, ListItemText, Checkbox, OutlinedInput, InputLabel, SelectChangeEvent } from '@mui/material';
import { ISecondOrderParams } from '../../models/ISecondOrderParams';
import { MathComponent } from "mathjax-react";
import './secondOrder.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 540,
    },
  },
};

const columns: GridColDef[] = [
  {
    field: 'value', headerName: 'Точка', width: 100, valueGetter: (params: GridValueGetterParams) =>
      `${params.row.value.toFixed(4)}`, pinnable: true
  },
  {
    field: 'tochne',
    headerName: 'Точне значення',
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.tochne.toFixed(8)}`
  },
  {
    field: 'euler',
    headerName: 'Метод Ейлера',
    description: 'This column has a value getter and is not sortable.',
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.euler.toFixed(8)}`,
  },
  {
    field: 'kutta',
    headerName: 'Метод РК4',
    description: 'This column has a value getter and is not sortable.',
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.kutta.toFixed(8)}`,
  },
  {
    field: 'auto',
    headerName: 'Автоматизований метод кроків',
    description: 'This column has a value getter and is not sortable.',
    width: 240,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.auto.toFixed(8)}`,
  }
];

const availableColumns: string[] = [
  'Точне значення',
  'Метод Ейлера',
  'Метод РК4',
  'Автоматизований метод кроків'
];

export const SecondOrder: React.FC = () => {
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(availableColumns);

  const [rows, setRows] = useState<IGridItem[]>([] as IGridItem[]);
  const [step, setStep] = useState<number | undefined>(100);
  const [t_0, setT_0] = useState<number>(0);
  const [t_end, setT_end] = useState<number>(2);
  const [alpha, setAlpha] = useState<number>(1);
  const [beta, setBeta] = useState<number>(-3);
  const [tau, setTau] = useState<number>(1);

  const [f_func, setF_func] = useState<string>('t-1');
  const [phi_func, setPhi_func] = useState<string>('t+4');

  const [linear, setLinear] = useState<boolean>(true);

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
        phi_func: phi_func,
        linear: linear
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
          kutta: el[3],
          auto: el[4]
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
    calculate();
    event.preventDefault();
  }

  const handleVisibleColumnChange = (event: SelectChangeEvent<typeof visibleColumns>) => {
    const {
      target: { value },
    } = event;
    setVisibleColumns(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <Box sx={{ height: '97vh', width: '100%', overflow: 'auto' }} className='order'>
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
          localeText={{ noRowsLabel: '' }}
        />
        <div className='vertical left-spacing' style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '20px',
          width: '90vh'
        }}>

          <form onSubmit={(event: any) => handleSubmit(event)} className='form-styles'>
            <div className='equation'>
              <MathComponent tex={String.raw`x'(t)=`} />
              <input required placeholder='α' value={alpha} className='input-value' onChange={(e: any) => setAlpha(e.target.value)} pattern="[0-9]*" style={{ width: '36px' }} />
              <MathComponent tex={String.raw`x(t)+`} />
              <input required placeholder='β' value={beta} className='input-value' onChange={(e: any) => setBeta(e.target.value)} style={{ width: '36px' }} />
              <MathComponent tex={String.raw`x(t-`} />
              <input required placeholder='τ' value={tau} className='input-value' onChange={(e: any) => setTau(e.target.value)} style={{ width: '36px' }} />
              <MathComponent tex={String.raw`)+`} />
              <input placeholder='f(x)' value={f_func} className='input-value' onChange={(e: any) => setF_func(e.target.value)} style={{ width: '72px' }} />
            </div>
            <div className='equation'>
              <MathComponent tex={String.raw`t ∈ [`} />
              <input required placeholder='t_0' value={t_0} className='input-value' onChange={(e: any) => setT_0(e.target.value)} style={{ width: '36px' }} />
              <MathComponent tex={String.raw`;`} />
              <input required placeholder='t' value={t_end} className='input-value' onChange={(e: any) => setT_end(e.target.value)} style={{ width: '36px' }} />
              <MathComponent tex={String.raw`]`} />
              <MathComponent tex={String.raw`,h=`} />
              <input required placeholder='h' value={step} className='input-value' onChange={(e: any) => setStep(e.target.value)} style={{ width: '48px' }} />
            </div>
            <div className='equation'>
              <MathComponent tex={String.raw`x(t)=`} />
              <input placeholder='φ(t)' value={phi_func} className='input-value' onChange={(e: any) => setPhi_func(e.target.value)} style={{ width: '72px' }} />
            </div>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="linear"
              name="radio-buttons-group"
              onChange={(e: any) => setLinear(e.target.value)}
            >
              <FormControlLabel value={true} control={<Radio />} label="Лінійне ДРР" />
              <FormControlLabel value={false} control={<Radio />} label="Нелінійне ДРР" />
            </RadioGroup>

            <div>
              <FormControl sx={{ m: 1, width: 610 }}>
                <InputLabel id="demo-multiple-checkbox-label">Видимі колонки</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={visibleColumns}
                  onChange={handleVisibleColumnChange}
                  input={<OutlinedInput label="Видимі колонки" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {availableColumns.map((column) => (
                    <MenuItem key={column} value={column}>
                      <Checkbox checked={visibleColumns.indexOf(column) > -1} />
                      <ListItemText primary={column} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <input type="submit" value="Обчислити" className='button-submit' />
            </div>
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
