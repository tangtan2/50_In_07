type PlayerPosition = "C" | "LW" | "RW" | "D" | "G";

type ShootCatchHand = "L" | "R" | null;

type Player = {
  id: number;
  name: string;
  nationality: string;
  primary_position: PlayerPosition;
  birth_date: Date;
  current_team_id: number;
  height: number;
  weight: number;
  rookie: boolean;
  captain: boolean;
  alternate_captain: boolean;
  shoot_catch: ShootCatchHand;
  player_contract_status_type_id: number;
  active: boolean;
};
