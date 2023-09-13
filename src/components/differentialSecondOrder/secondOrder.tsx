import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import api from '../../services/apiService';
import { IGridItem } from '../../models/IGridItem';

const columns: GridColDef[] = [
    { field: 'value', headerName: 'Точка', width: 110, valueGetter: (params: GridValueGetterParams) => 
        `${params.row.value.toFixed(4)}` },
    {
      field: 'x',
      headerName: 'Значення X',
      width: 160,
      valueGetter: (params: GridValueGetterParams) => 
        `${params.row.x.toFixed(8)}`,
      editable: true,
    },
    {
      field: 'y',
      headerName: 'Значення Y',
      description: 'This column has a value getter and is not sortable.',
      editable: true,
      width: 160,
      valueGetter: (params: GridValueGetterParams) => 
      `${params.row.y.toFixed(8)}`,
    },
  ];

export const SecondOrder: React.FC = () => {
    const [rows, setRows] = useState<IGridItem[]>([] as IGridItem[]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get('');

            let data: IGridItem[] = [];
            let i = 1;
            response.data.data.forEach((el: any) => {
                data.push({
                    id: i++,
                    value: el[0],
                    x: el[1],
                    y: el[2]
                });
            });

            setRows(data);
        }
        
        fetchData();
    }, []);

    return (
        <Box sx={{ height: '100%', width: '40%' }}>
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
            pageSizeOptions={[10, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      );
}
