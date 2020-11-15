CREATE TABLE "conferences" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "divisions" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "game_category_types" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "game_period_types" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "play_event_types" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL,
  "parent_play_event_type_id" int,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "play_player_types" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "play_event_type_id" int NOT NULL,
  "name" varchar(50) NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "player_contract_status_types" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" varchar(2000) NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(200) NOT NULL,
  "user_role_id" int NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "user_roles" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" varchar(2000) NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "user_permissions" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) UNIQUE NOT NULL,
  "description" varchar(2000) NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "user_role_to_permission_mappings" (
  "user_role_id" int NOT NULL,
  "user_permission_id" int NOT NULL,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "seasons" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) UNIQUE NOT NULL,
  "regular_season_start_date" date NOT NULL,
  "regular_season_end_date" date NOT NULL,
  "season_end_date" date NOT NULL,
  "winning_team_id" int,
  "num_games" int NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "teams" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(200) UNIQUE NOT NULL,
  "abbreviation" varchar(3) UNIQUE NOT NULL,
  "active" boolean NOT NULL,
  "conference_id" int,
  "division_id" int,
  "date_established" date NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "games" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) UNIQUE NOT NULL,
  "season_id" int NOT NULL,
  "game_category_type_id" int NOT NULL,
  "game_time" timestamp NOT NULL,
  "away_team_id" int NOT NULL,
  "home_team_id" int NOT NULL,
  "away_goals" int NOT NULL,
  "home_goals" int NOT NULL,
  "home_rink_side_start" varchar(10),
  "settled_in_game_period_type_id" int,
  "winning_team_id" int,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "players" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(200) UNIQUE NOT NULL,
  "nationality" varchar(3),
  "primary_position" varchar(5) NOT NULL,
  "birth_date" date,
  "current_team_id" int,
  "height" double precision,
  "weight" double precision,
  "rookie" boolean,
  "captain" boolean,
  "alternate_captain" boolean,
  "shoot_catch" varchar(1),
  "player_contract_status_type_id" int NOT NULL,
  "jersey_number" int,
  "active" boolean NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "plays" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) UNIQUE NOT NULL,
  "game_id" int NOT NULL,
  "play_number" int NOT NULL,
  "for_team_id" int NOT NULL,
  "against_team_id" int NOT NULL,
  "play_event_type_id" int NOT NULL,
  "x_coord" double precision NOT NULL,
  "y_coord" double precision NOT NULL,
  "secondary_play_event_type_id" int,
  "game_period_type_id" int NOT NULL,
  "game_period_time" interval minute,
  "game_period_time_remaining" interval minute,
  "play_time" timestamp NOT NULL,
  "goals_away" int NOT NULL,
  "goals_home" int NOT NULL,
  "strength" varchar(50),
  "empty_net" boolean,
  "game_winning_goal" boolean,
  "home_team_id" int NOT NULL,
  "away_team_id" int NOT NULL,
  "created_at" timestamp NOT NULL,
  "created_by" int NOT NULL
);

CREATE TABLE "teams_per_game" (
  "team_id" int NOT NULL,
  "game_id" int NOT NULL,
  "home_or_away" varchar(1) NOT NULL,
  "won" boolean NOT NULL,
  "goals" int NOT NULL,
  "shots" int NOT NULL,
  "hits" int NOT NULL,
  "penalty_minutes" int NOT NULL,
  "power_play_opportunities" int NOT NULL,
  "power_play_goals" int NOT NULL,
  "faceoff_win_percentage" double precision NOT NULL,
  "takeaways" int NOT NULL,
  "giveaways" int NOT NULL,
  "goalie_pulled" boolean NOT NULL
);

CREATE TABLE "players_per_game" (
  "player_id" int NOT NULL,
  "game_id" int NOT NULL,
  "team_id" int NOT NULL,
  "time_on_ice" interval minute NOT NULL,
  "assists" int NOT NULL,
  "goals" int NOT NULL,
  "shots" int NOT NULL,
  "hits" int NOT NULL,
  "power_play_assists" int NOT NULL,
  "power_play_goals" int NOT NULL,
  "short_assists" int NOT NULL,
  "short_goals" int NOT NULL,
  "penalty_minutes" int NOT NULL,
  "faceoffs_won" int NOT NULL,
  "faceoffs_taken" int NOT NULL,
  "takeaways" int NOT NULL,
  "giveaways" int NOT NULL,
  "blocked" int NOT NULL,
  "plus_minus" int NOT NULL,
  "power_play_time_on_ice" interval minute NOT NULL,
  "even_time_on_ice" interval minute NOT NULL,
  "short_time_on_ice" interval minute NOT NULL
);

CREATE TABLE "goalies_per_game" (
  "player_id" int NOT NULL,
  "game_id" int NOT NULL,
  "team_id" int NOT NULL,
  "assists" int NOT NULL,
  "goals" int NOT NULL,
  "penalty_minute" int NOT NULL,
  "saves" int NOT NULL,
  "power_play_saves" int NOT NULL,
  "even_saves" int NOT NULL,
  "short_saves" int NOT NULL,
  "shots_against" int NOT NULL,
  "power_play_shots_against" int NOT NULL,
  "even_shots_against" int NOT NULL,
  "short_shots_against" int NOT NULL,
  "time_on_ice" interval minute NOT NULL
);

CREATE TABLE "players_per_play" (
  "player_id" int NOT NULL,
  "play_id" int NOT NULL,
  "play_player_type_id" int NOT NULL
);

CREATE TABLE "single_season_team_stats" (
  "team_id" int NOT NULL,
  "season_id" int NOT NULL,
  "games_played" int NOT NULL,
  "wins" int NOT NULL,
  "losses" int NOT NULL,
  "overtime" int,
  "points" int NOT NULL,
  "point_percentage" double precision NOT NULL,
  "goals_per_game" double precision NOT NULL,
  "goals_against_per_game" double precision NOT NULL,
  "ev_gga_ratio" double precision NOT NULL,
  "power_play_percentage" double precision NOT NULL,
  "power_play_goals" int NOT NULL,
  "power_play_goals_against" int NOT NULL,
  "power_play_opportunities" int NOT NULL,
  "penalty_kill_percentage" double precision NOT NULL,
  "shots_per_game" double precision NOT NULL,
  "shots_allowed" double precision NOT NULL,
  "win_score_first" double precision NOT NULL,
  "win_opp_score_first" double precision NOT NULL,
  "win_lead_first_period" double precision NOT NULL,
  "win_lead_second_period" double precision NOT NULL,
  "win_outshoot_opp" double precision NOT NULL,
  "win_outshot_by_opp" double precision NOT NULL,
  "faceoffs_won" int,
  "faceoffs_lost" int,
  "faceoffs_taken" int,
  "shooting_percentage" double precision,
  "save_percentage" double precision
);

CREATE TABLE "single_season_player_stats" (
  "player_id" int NOT NULL,
  "season_id" int NOT NULL,
  "time_on_ice" interval minute,
  "assists" int NOT NULL,
  "goals" int NOT NULL,
  "shots" int NOT NULL,
  "hits" int,
  "games" int NOT NULL,
  "penalty_minutes" int NOT NULL,
  "power_play_goals" int NOT NULL,
  "power_play_points" int NOT NULL,
  "power_play_time_on_ice" interval minute,
  "even_time_on_ice" interval minute,
  "short_goals" int NOT NULL,
  "short_points" int NOT NULL,
  "short_time_on_ice" interval minute,
  "faceoff_win_percentage" double precision,
  "game_winning_goals" int NOT NULL,
  "overtime_goals" int NOT NULL,
  "blocked" int,
  "plus_minus" int NOT NULL,
  "points" int NOT NULL,
  "shifts" int
);

CREATE TABLE "single_season_goalie_stats" (
  "player_id" int NOT NULL,
  "season_id" int NOT NULL,
  "overtime" int,
  "shutouts" int NOT NULL,
  "ties" int,
  "wins" int NOT NULL,
  "losses" int NOT NULL,
  "saves" int NOT NULL,
  "power_play_saves" int,
  "power_play_shots" int,
  "short_saves" int,
  "short_shots" int,
  "even_saves" int,
  "even_shots" int,
  "save_percentage" double precision NOT NULL,
  "goals_against_average" double precision NOT NULL,
  "games" int NOT NULL,
  "games_started" int NOT NULL,
  "shots_against" int NOT NULL,
  "goals_against" int NOT NULL,
  "time_on_ice" interval minute NOT NULL
);

ALTER TABLE "conferences" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "divisions" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "game_category_types" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "game_period_types" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "play_event_types" ADD FOREIGN KEY ("parent_play_event_type_id") REFERENCES "play_event_types" ("id");

ALTER TABLE "play_event_types" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "play_player_types" ADD FOREIGN KEY ("play_event_type_id") REFERENCES "play_event_types" ("id");

ALTER TABLE "play_player_types" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "player_contract_status_types" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("user_role_id") REFERENCES "user_roles" ("id");

ALTER TABLE "user_role_to_permission_mappings" ADD FOREIGN KEY ("user_role_id") REFERENCES "user_roles" ("id");

ALTER TABLE "user_role_to_permission_mappings" ADD FOREIGN KEY ("user_permission_id") REFERENCES "user_permissions" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("game_category_type_id") REFERENCES "game_category_types" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("away_team_id") REFERENCES "teams" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("home_team_id") REFERENCES "teams" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("settled_in_game_period_type_id") REFERENCES "game_period_types" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "players" ADD FOREIGN KEY ("current_team_id") REFERENCES "teams" ("id");

ALTER TABLE "players" ADD FOREIGN KEY ("player_contract_status_type_id") REFERENCES "player_contract_status_types" ("id");

ALTER TABLE "players" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("for_team_id") REFERENCES "teams" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("against_team_id") REFERENCES "teams" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("play_event_type_id") REFERENCES "play_event_types" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("secondary_play_event_type_id") REFERENCES "play_event_types" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("game_period_type_id") REFERENCES "game_period_types" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("home_team_id") REFERENCES "teams" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("away_team_id") REFERENCES "teams" ("id");

ALTER TABLE "plays" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("winning_team_id") REFERENCES "teams" ("id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("conference_id") REFERENCES "conferences" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("division_id") REFERENCES "divisions" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "teams_per_game" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "teams_per_game" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

ALTER TABLE "players_per_game" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

ALTER TABLE "players_per_game" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

ALTER TABLE "players_per_game" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "goalies_per_game" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

ALTER TABLE "goalies_per_game" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

ALTER TABLE "goalies_per_game" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "players_per_play" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

ALTER TABLE "players_per_play" ADD FOREIGN KEY ("play_id") REFERENCES "plays" ("id");

ALTER TABLE "players_per_play" ADD FOREIGN KEY ("play_player_type_id") REFERENCES "play_player_types" ("id");

ALTER TABLE "single_season_team_stats" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "single_season_team_stats" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "single_season_player_stats" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

ALTER TABLE "single_season_player_stats" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "single_season_goalie_stats" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

ALTER TABLE "single_season_goalie_stats" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

CREATE UNIQUE INDEX ON "play_player_types" ("play_event_type_id", "name");

CREATE UNIQUE INDEX ON "user_role_to_permission_mappings" ("user_role_id", "user_permission_id");

CREATE UNIQUE INDEX ON "teams_per_game" ("team_id", "game_id");

CREATE UNIQUE INDEX ON "players_per_game" ("player_id", "game_id", "team_id");

CREATE UNIQUE INDEX ON "goalies_per_game" ("player_id", "game_id", "team_id");

CREATE UNIQUE INDEX ON "players_per_play" ("player_id", "play_id");

CREATE UNIQUE INDEX ON "single_season_team_stats" ("team_id", "season_id");

CREATE UNIQUE INDEX ON "single_season_player_stats" ("player_id", "season_id");

CREATE UNIQUE INDEX ON "single_season_goalie_stats" ("player_id", "season_id");
