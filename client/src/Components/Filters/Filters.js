import React, { useState, useEffect } from 'react';
import './Filters.scss';
import { TextField, Checkbox } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

const Filters = ({ data }) => {
    var [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [glasses, setGlasses] = useState([]);
    const [alcoholicFilters, setAlcoholicFilters] = useState([]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleCategories = (event, newValue) => {
        setCategories(newValue);
    };

    const handleIngredients = (event, newValue) => {
        setIngredients(newValue);
    };

    const handleGlasses = (event, newValue) => {
        setGlasses(newValue);
    };

    const handleAlcoholicFilters = (event, newValue) => {
        setAlcoholicFilters(newValue);
    };


    useEffect(() => {
        // Send filters
        if (search !== "" || categories.length !== 0 || categories.length !== 0 
                || ingredients.length !== 0 || glasses.length !== 0 || glasses.length !== 0) {
            console.log("Send filters to backend");
            console.log({
                search: search,
                categories: categories,
                ingredients: ingredients,
                glasses: glasses,
                alcoholicFilters: alcoholicFilters
            });
        } else {
            console.log("Show all");
        }
    });

    const renderCheckBox = (option, selected) => {
        return (
            <React.Fragment>
                <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                />
                {option}
            </React.Fragment>
        );
    };

    const renderAutocomplete = (onChange, value, options, label ) => {
        return (
            <Autocomplete
                onChange={onChange}
                value={value}
                multiple
                options={options}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                renderOption={(option, { selected }) => (
                    renderCheckBox(option, selected)
                )}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label={label} placeholder="" />
                )}
            />
        );
    };

    return (
        // Content
        <div id="filters">
            <h1>Filters</h1>
            <div className="filter">
                <TextField onChange={handleSearch} value={search} label="Search" variant="outlined" />
            </div>
            <div className="filter">
                {renderAutocomplete(handleCategories, categories, data.categories, "Categories")}
            </div>
            <div className="filter">
                {renderAutocomplete(handleIngredients, ingredients, data.ingredients, "Ingredients")}
            </div>
            <div className="filter">
                {renderAutocomplete(handleGlasses, glasses, data.glasses, "Glasses")}
            </div>
            <div className="filter">
                {renderAutocomplete(handleAlcoholicFilters, alcoholicFilters, data.alcoholicFilters, "Alcohol Content")}
            </div>
        </div>
    );
};

export default Filters;