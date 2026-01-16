"""
Generate Space Race CSV file from the all_space_mission_launches dataset.

This script filters the original dataset to include only missions from 1957-1975
(the Space Race era), adds Country and Superpower columns, and removes the
Price and Rocket_Status columns.
"""

import pandas as pd


def extract_country(location: str) -> str:
    """Extract country from location string (last part after comma)."""
    if pd.isna(location):
        return "Unknown"
    return location.split(',')[-1].strip()


def classify_superpower(row: pd.Series) -> str:
    """
    Classify launches as USA, USSR, or Other based on country and organization.
    
    USSR launches came from:
    - Russia (RSFSR during Soviet era)
    - Kazakhstan (Baikonur Cosmodrome was the main Soviet launch site)
    
    Organizations associated with USSR:
    - RVSN USSR (Soviet Strategic Rocket Forces)
    - VKS RF (became Russian Aerospace Forces, but during USSR was Soviet)
    """
    country = str(row['Country'])
    org = str(row['Organisation'])
    
    # USA identification
    usa_keywords = ['USA', 'United States']
    if any(kw in country for kw in usa_keywords):
        return 'USA'
    
    # USSR identification - countries that were part of Soviet space program
    ussr_countries = ['Russia', 'Kazakhstan']
    ussr_orgs = ['RVSN USSR', 'VKS RF', 'Roscosmos', 'Soviet']
    
    if any(c in country for c in ussr_countries):
        return 'USSR'
    if any(o in org for o in ussr_orgs):
        return 'USSR'
    
    return 'Other'


def generate_space_race_csv(
    input_file: str = 'all_space_mission_launches.csv',
    output_file: str = 'space_race_missions.csv'
) -> pd.DataFrame:
    """
    Generate the Space Race CSV file.
    
    Args:
        input_file: Path to the original space missions CSV file
        output_file: Path for the output Space Race CSV file
        
    Returns:
        The filtered and processed DataFrame
    """
    # Load the original dataset
    df = pd.read_csv(input_file, index_col=0)
    
    # Parse datetime and extract year
    df['Datetime_parsed'] = pd.to_datetime(
        df['Datetime'], 
        format='%a %b %d, %Y %H:%M UTC', 
        errors='coerce'
    )
    df['Year'] = df['Datetime_parsed'].dt.year
    
    # Filter to Space Race era (1957-1975)
    df_space_race = df[(df['Year'] >= 1957) & (df['Year'] <= 1975)].copy()
    
    # Extract country from location
    df_space_race['Country'] = df_space_race['Location'].apply(extract_country)
    
    # Classify superpower
    df_space_race['Superpower'] = df_space_race.apply(classify_superpower, axis=1)
    
    # Drop Price and Rocket_Status columns
    columns_to_drop = ['Price', 'Rocket_Status', 'Datetime_parsed']
    df_space_race = df_space_race.drop(columns=columns_to_drop)
    df_space_race.rename(columns={'Details': 'Name'}, inplace=True)
    
    # Reorder columns to have Country and Superpower in a logical position
    column_order = [
        'Organisation', 'Location', 'Country', 'Superpower', 
        'Datetime', 'Year', 'Name', 'Mission_Status'
    ]
    df_space_race = df_space_race[column_order]
    df_space_race.index.name = 'Original_ID'

    # Save to CSV
    df_space_race.to_csv(output_file, index=True)
    
    print("Space Race CSV generated successfully!")
    print(f"  Input file: {input_file}")
    print(f"  Output file: {output_file}")
    print(f"  Total missions: {len(df_space_race)}")
    print("\nSuperpower distribution:")
    print(df_space_race['Superpower'].value_counts())
    print("\nCountry distribution:")
    print(df_space_race['Country'].value_counts())
    
    return df_space_race


if __name__ == '__main__':
    df = generate_space_race_csv()
