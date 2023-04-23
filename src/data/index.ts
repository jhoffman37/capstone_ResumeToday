import { UserDB, User } from "./userDB";
import { ResumeDB, Resume } from "./resumeDB";

const Data = {
  Users: UserDB,
  Resumes: ResumeDB,
}

export default Data;
export { User, Resume };
