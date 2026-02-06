import type { CollectionBeforeValidateHook } from "payload";
import { ValidationError } from "payload";

/**
 * Password Validation Hook
 * Ensures passwords meet security requirements:
 * - At least 12 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character (@$!%*?&)
 */
export const validatePassword: CollectionBeforeValidateHook = ({ data }) => {
	// Only validate if a password is being set (creation or update)
	if (data?.password) {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

		if (!regex.test(data.password)) {
			throw new ValidationError({
				errors: [
					{
						message:
							"Password must be at least 12 characters and include an uppercase letter, a number, and a special character.",
						path: "password",
					},
				],
			});
		}
	}
	return data;
};
