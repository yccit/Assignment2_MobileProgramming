# Personal Lifestyle & Utility Dashboard (LifestyleDash)


# Project Overview
LifestyleDash is a hybrid mobile application built to assist users with daily utility tasks. It integrates three distinct API services into a single "Dashboard" interface, featuring a modern Dark Mode UI powered by Tailwind CSS.

# Technologies Used
Core: HTML5, JavaScript 
Styling: Tailwind CSS
Data Persistence: LocalStorage (for user interaction logs)

# API Integrations (Distinct Providers)
This application integrates 3 distinct APIs to meet the "Multi-API" requirement:

1.  Food & Dining:
    API:`TheMealDB`
    Function: Fetches random meal recipes, categories, and video links.
    
2.  Finance & Assets (Logic & Calculation Module):
    API:`CoinGecko` (Bitcoin Price)
    Logic:Calculates the user's total portfolio value (*User Input × Current Price*).
    Conditional UI: Changes the card background to **Green** (High Value) or **Red** (Entry Level) based on a $50,000 threshold.
    
3.  Entertainment:
    API:`Rick and Morty API`
    Function:Generates random character profiles from the database.

# Team Member: YEOH CHONG CHAO (301334), TIMOTHY LAI JUN HONG (297880)
