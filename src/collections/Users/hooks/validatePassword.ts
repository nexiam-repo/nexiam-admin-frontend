import type { CollectionBeforeValidateHook } from "payload";
import { ValidationError } from "payload";

/**
 * Password Validation Hook
 * Ensures passwords meet security requirements:
 * - At least 12 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character (e.g., @$!%*?&.-_+#)
 */
export const validatePassword: CollectionBeforeValidateHook = ({ data }) => {
	// Only validate if a password is being set (creation or update)
	if (data?.password) {
		// Allow common special characters: @$!%*?&.-_+#()[]{}:;"'<>,/\|~
		const regex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-_+#()[\]{}:;"'<>,/\\|~])[A-Za-z\d@$!%*?&.\-_+#()[\]{}:;"'<>,/\\|~]{12,}$/;

		if (!regex.test(data.password)) {
			throw new ValidationError({
				errors: [
					{
						message:
							"Password must be at least 12 characters and include: uppercase, lowercase, number, and special character (e.g., @$!%*?&.-_+#)",
						path: "password",
					},
				],
			});
		}
	}
	return data;
};
