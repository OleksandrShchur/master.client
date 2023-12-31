import React, { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import api from '../../services/apiService';
import { IGridItem } from '../../models/IGridItem';
import { Alert, FormControlLabel, LinearProgress, Radio, Snackbar, RadioGroup, FormControl, Checkbox, FormLabel, FormGroup } from '@mui/material';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ISecondOrderParams } from '../../models/ISecondOrderParams';
import { MathComponent } from "mathjax-react";
import './secondOrder.css';
import { DiagramModal } from '../diagramModal/diagramModal';

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

export const SecondOrder: React.FC = () => {
  const [visibleColumns, setVisibleColumns] = React.useState({
    exactValue: true,
    euler: true,
    rk4: true,
    automation: true
  });
  const { exactValue, euler, rk4, automation } = visibleColumns;

  const [rows, setRows] = useState<IGridItem[]>([] as IGridItem[]);
  const [step, setStep] = useState<number | undefined>(100);
  const [t_0, setT_0] = useState<number>(0);
  const [t_end, setT_end] = useState<number>(2);
  const [alpha, setAlpha] = useState<number>(1);
  const [beta, setBeta] = useState<number>(-3);
  const [tau, setTau] = useState<number>(1);

  const f_func_linearPlaceholder = 'f(t)';
  const f_func_nonLinearPlaceHolder = 'f(x)';
  const [f_func, setF_func] = useState<string>('t-1');
  const [phi_func, setPhi_func] = useState<string>('t+4');

  const [linear, setLinear] = useState<string>("true");

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [diagramModalVisible, setDiagramModalVisible] = useState<boolean>(false);

  const handleAlertClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

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

  const handleVisibleColumnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisibleColumns({
      ...visibleColumns,
      [event.target.name]: event.target.checked,
    });
  };

  const handleModalVisible = () => {
    setDiagramModalVisible(!diagramModalVisible);
  }

  const handleLinearChange = (e: any) => {
    setLinear(e.target.value);
  }

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
          columnVisibilityModel={{
            tochne: exactValue,
            euler: euler,
            kutta: rk4,
            auto: automation,
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
              <input placeholder={linear === 'true' ? f_func_linearPlaceholder : f_func_nonLinearPlaceHolder} value={f_func} className='input-value' onChange={(e: any) => setF_func(e.target.value)} style={{ width: '72px' }} />
            </div>
            <div className='equation'>
              <MathComponent tex={String.raw`t ∈ [`} />
              <input required placeholder='t_0' value={t_0} className='input-value' onChange={(e: any) => setT_0(e.target.value)} style={{ width: '36px' }} />
              <MathComponent tex={String.raw`;`} />
              <input required placeholder='t' value={t_end} className='input-value' onChange={(e: any) => setT_end(e.target.value)} style={{ width: '36px' }} />
              <MathComponent tex={String.raw`]`} />
              <MathComponent tex={String.raw`,m=`} />
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
              value={linear}
              onChange={(e: any) => handleLinearChange(e)}
            >
              <FormControlLabel value="true" control={<Radio color='secondary' />} label="Лінійне ДРР" />
              <FormControlLabel value="false" control={<Radio color='secondary' />} label="Нелінійне ДРР" />
            </RadioGroup>

            <div><FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormLabel component="legend">Видимі колонки</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={exactValue} icon={<ControlPointOutlinedIcon />}
                      checkedIcon={<AddCircleIcon />} color='secondary' onChange={handleVisibleColumnChange} name="exactValue" />
                  }
                  label="Точне значення"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={euler} icon={<ControlPointOutlinedIcon />}
                      checkedIcon={<AddCircleIcon />} color="secondary" onChange={handleVisibleColumnChange} name="euler" />
                  }
                  label="Метод Ейлера"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={rk4} icon={<ControlPointOutlinedIcon />}
                      checkedIcon={<AddCircleIcon />} color="secondary" onChange={handleVisibleColumnChange} name="rk4" />
                  }
                  label="Метод РК4"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={automation} icon={<ControlPointOutlinedIcon />}
                      checkedIcon={<AddCircleIcon />} color="secondary" onChange={handleVisibleColumnChange} name="automation" />
                  }
                  label="Автоматизований метод кроків"
                />
              </FormGroup>
            </FormControl></div>

            <div className='submin-container'>
              {rows.length !== 0 && <input type="button" value="Графік" className='button-submit' onClick={handleModalVisible} />}
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

      <DiagramModal handleClose={handleModalVisible} visible={diagramModalVisible} data={rows} />
    </>
  );
}
