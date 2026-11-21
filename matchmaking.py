import random
import time 

# current tiers are based on complete rosters (as of 11-19-26); injuries are NOT accounted for
teams = {
    "San Antonio Spurs": {"id": 1, "tier": "Good"},
    "Los Angeles Lakers": {"id": 2, "tier": "Good"},
    "Houston Rockets": {"id": 3, "tier": "Good"},
    "Minnesota Timberwolves": {"id": 4, "tier": "Good"},
    "Memphis Grizzlies": {"id": 5, "tier": "Mid"},
    "Portland Trailblazers": {"id": 6, "tier": "Mid"},
    "Oklahoma City Thunder": {"id": 7, "tier": "Good"},
    "Denver Nuggets": {"id": 8, "tier": "Good"},
    "Golden State Warriors": {"id": 9, "tier": "Mid"},
    "Dallas Mavericks": {"id": 10, "tier": "Mid"},
    "Phoenix Suns": {"id": 11, "tier": "Mid"},
    "Los Angeles Clippers": {"id": 12, "tier": "Bad"},
    "New Orleans Pelicans": {"id": 13, "tier": "Bad"},
    "Sacramento Kings": {"id": 14, "tier": "Bad"},
    "Utah Jazz": {"id": 15, "tier": "Bad"},
    "Philadelphia 76ers": {"id": 16, "tier": "Good"},
    "Boston Celtics": {"id": 17, "tier": "Good"},
    "Detroit Pistons": {"id": 18, "tier": "Good"},
    "Miami Heat": {"id": 19, "tier": "Good"},
    "Atlanta Hawks": {"id": 20, "tier": "Mid"},
    "New York Knicks": {"id": 21, "tier": "Good"},
    "Cleveland Cavaliers": {"id": 22, "tier": "Good"},
    "Orlando Magic": {"id": 23, "tier": "Mid"},
    "Toronto Raptors": {"id": 24, "tier": "Good"},
    "Indiana Pacers": {"id": 25, "tier": "Bad"},
    "Charlotte Hornets": {"id": 26, "tier": "Bad"},
    "Washington Wizards": {"id": 27, "tier": "Bad"},
    "Brooklyn Nets": {"id": 28, "tier": "Bad"},
    "Chicago Bulls": {"id": 29, "tier": "Bad"},
    "Milwaukee Bucks": {"id": 30, "tier": "Bad"},
}

def get_team_info(target_id):
    for name, data in teams.items():
        if data["id"] == target_id:
            return name, data
    return None, None

selection = input("Restrictions? (y/n): ").strip().lower()

team1_id = random.randint(1, 30)
name1, data1 = get_team_info(team1_id)

if selection == "y":
  allowed_ids = [
      data["id"]
      for data in teams.values()
      if data["tier"] == data1["tier"] and data["id"] != team1_id
  ]
  team2_id = random.choice(allowed_ids)
else:
  allowed_ids = [
      data["id"] for data in teams.values() if data["id"] != team1_id
  ]
  team2_id = random.choice(allowed_ids)

name2, data2 = get_team_info(team2_id)

# for dramatic effect
print("Rolling...")
time.sleep(1.5)
print(name1)
time.sleep(1)
print("vs")
time.sleep(2)
print(name2)