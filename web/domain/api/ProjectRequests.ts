export interface CreateProjectRequestDto {
  project: {
    name: string;
    description: string;
  };
}

export interface UpdateProjectRequestDto {
  project: {
    name?: string;
    description?: string;
  };
}
