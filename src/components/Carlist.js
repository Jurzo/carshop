import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCar from './AddCar';
import EditCar from './EditCar';
import SnackBar from '@material-ui/core/Snackbar';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Carlist() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const openSnackBar = () => {
    setOpen(true);
  }

  const closeSnackBar = () => {
    setOpen(false);
  }

  const fetchCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
      .then(response => response.json())
      .then(data => setCars(data._embedded.cars))
      .catch(err => console.error(err))
  }

  const deleteCar = (url) => {
    if (window.confirm('Are you sure?')) {
      fetch(url, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            fetchCars();
            openSnackBar();
          }
          else
            alert('Something went wrong in deletion');
        })
        .catch(err => console.error(err))
    }
  }

  const addCar = (newCar) => {
    fetch('https://carstockrest.herokuapp.com/cars',
      {
        method: 'POST',
        body: JSON.stringify(newCar),
        headers: { 'Content-type': 'application/json' }
      })
      .then(_ => fetchCars())
      .catch(err => console.error(err))
  }

  const updateCar = (url, car) => {
    fetch(url,
      {
        method: 'PUT',
        body: JSON.stringify(car),
        headers: { 'Content-type': 'application/json' }
      })
      .then(_ => fetchCars())
      .catch(err => console.log(err));
  }

  const columns = [
    { field: 'brand', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    { field: 'color', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true, width: 100 },
    { field: 'fuel', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true, width: 100 },
    {
      headerName: '',
      field: '_links.self.href',
      cellRendererFramework: params =>
        <EditCar link={params.value} car={params.data} updateCar={updateCar} />
    },
    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params =>
        <IconButton color="secondary" onClick={() => deleteCar(params.value)}>
          <DeleteIcon />
        </IconButton>
    }
  ]

  return (
    <div>
      <AddCar addCar={addCar} />
      <div className="ag-theme-material" style={{ height: 600, width: '85%', margin: 'auto' }}>
        <AgGridReact
          rowData={cars}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={8}
          floatingFilter={true}
          suppressCellSelection={true}
        />
      </div>
      <SnackBar
        open={open}
        message="Car deleted"
        autoHideDuration={3000}
        onClose={closeSnackBar}
      />
    </div>
  )
}

export default Carlist;