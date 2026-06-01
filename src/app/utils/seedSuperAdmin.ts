import bcrypt from "bcryptjs";
import { envVars } from "../config/envVars";
import { User } from "../modules/user/user.model.js";
import { UserRole, type IUser } from "../modules/user/user.interface.js";
// import { UserRole, type IAuthProvider, type IUser } from "../modules/user/user.interface.js";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }
    console.log("Trying to create Super Admin...!");

    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    const payload: Partial<IUser> = {
      f_name: envVars.SUPER_ADMIN,
      role: UserRole.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      is_verified: true,
    };

    const superAdmin = await User.create(payload);
    console.log("Super Admin Created Successfuly!\n");
    console.log(superAdmin);
  } catch (err) {
    console.log(err);
  }
};
