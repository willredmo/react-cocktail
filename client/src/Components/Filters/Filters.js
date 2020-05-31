import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import './Filters.scss';
import { TextField, Checkbox } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

const Filters = forwardRef((props, ref) => {
    // Hide show filters for mobile
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
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

    // console.log(props);


    useEffect(() => {
        // Send filters
        const filters = {
            search: search,
            categories: categories,
            ingredients: ingredients,
            glasses: glasses,
            alcoholicFilters: alcoholicFilters
        };
        
        if (search !== "" || categories.length !== 0 || categories.length !== 0 
                || ingredients.length !== 0 || glasses.length !== 0 || glasses.length !== 0) {
            console.log("Send filters to backend");
            // console.log(filters);
        } else {
            console.log("Show all");
        }
             
    }, [search, categories, ingredients, glasses, alcoholicFilters]);


    useImperativeHandle(ref, () => ({
        handleShowFilters() {
            if (!showFilters) {
                console.log("Show");
            } else {
                console.log("Hide");
            }
            setShowFilters(!showFilters);
        }
    }));

    const renderCheckBox = (option, selected) => {
        return (
            <React.Fragment>
                <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    color="primary"
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
                getOptionLabel={(option) => option.name}
                renderOption={(option, { selected }) => (
                    renderCheckBox(option.name, selected)
                )}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label={label} placeholder="" />
                )}
            />
        );
    };

    return (
        // Content
        <div id="filters" className={showFilters ? "show" : "hide"}>
            <h1>Filters</h1>
            <div className="filter">
                <TextField onChange={handleSearch} value={search} label="Search" variant="outlined" />
            </div>
            <div className="filter">
                {renderAutocomplete(handleCategories, categories, props.data.categories, "Categories")}
            </div>
            <div className="filter">
                {renderAutocomplete(handleIngredients, ingredients, props.data.ingredients, "Ingredients")}
            </div>
            <div className="filter">
                {renderAutocomplete(handleGlasses, glasses, props.data.glasses, "Glasses")}
            </div>
            <div className="filter">
                {renderAutocomplete(handleAlcoholicFilters, alcoholicFilters, props.data.alcoholicFilters, "Alcohol Content")}
            </div>
        </div>
    );
});

export default Filters;