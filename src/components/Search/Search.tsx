import { styled, alpha } from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react"

interface SearchProps {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const Search = ({ searchQuery, setSearchQuery }: SearchProps) => {
  const [searchState, setSearchState] = useState(searchQuery)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchQuery(searchState)
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchState(e.target.value)
    setSearchQuery(e.target.value)
  }
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e)
      }}>
      <SearchWrapper>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          onChange={(e) => {
            handleChange(e)
          }}
          value={searchState}
          placeholder='Search…'
          inputProps={{ "aria-label": "search" }}
        />
      </SearchWrapper>
      <input type='submit' value='Search' hidden />
    </form>
  )
}

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}))

export default Search
